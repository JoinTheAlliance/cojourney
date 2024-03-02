import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import jwt from '@tsndr/cloudflare-worker-jwt'
import { type UUID } from 'crypto'
import {
  composeContext,
  defaultActions,
  defaultEvaluators,
  embeddingZeroVector,
  BgentRuntime,
  type Content,
  type Memory,
  type Message,
  type State,
  parseJSONObjectFromText,
  messageHandlerTemplate
} from 'bgent'
import actions from './actions'
import evaluators from './evaluators'

/**
 * Handle an incoming message, processing it and returning a response.
 * @param message The message to handle.
 * @param state The state of the agent.
 * @returns The response to the message.
 */
async function handleMessage (
  runtime: BgentRuntime,
  message: Message,
  state?: State
) {
  console.log('**** handling message')
  const _saveRequestMessage = async (message: Message, state: State) => {
    const { content: senderContent /* senderId, userIds, room_id */ } = message

    // we run evaluation here since some evals could be modulo based, and we should run on every message
    if ((senderContent as Content).content?.trim() ?? senderContent) {
      // await runtime.messageManager.createMemory({
      //   user_ids: userIds!,
      //   user_id: senderId!,
      //   content: {
      //     content: _senderContent,
      //     action: (message.content as Content)?.action ?? "null",
      //   },
      //   room_id,
      //   embedding: embeddingZeroVector,
      // });
      await runtime.evaluate(message, state)
    }
  }

  await _saveRequestMessage(message, state as State)
  if (!state) {
    state = (await runtime.composeState(message)) as State
  }

  const context = composeContext({
    state,
    template: messageHandlerTemplate
  })

  if (runtime.debugMode) {
    console.log(context, 'Response Context')
  }

  let responseContent: Content | null = null
  const { senderId, room_id, userIds: user_ids, agentId } = message

  for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
    console.log('*** trying completion:')
    console.log(context)
    const response = await runtime.completion({
      context,
      stop: []
    })

    runtime.supabase
      .from('logs')
      .insert({
        body: { message, context, response },
        user_id: senderId,
        room_id,
        user_ids: user_ids!,
        agent_id: agentId!,
        type: 'main_completion'
      })
      .then(({ error }) => {
        if (error) {
          console.error('error', error)
        }
      })

    const parsedResponse = parseJSONObjectFromText(
      response
    ) as unknown as Content

    console.log('parsedResponse', parsedResponse)

    if (
      (parsedResponse.user as string)?.includes(
        (state as State).agentName as string
      )
    ) {
      responseContent = {
        content: parsedResponse.content,
        action: parsedResponse.action
      }
      break
    }
  }

  if (!responseContent) {
    responseContent = {
      content: '',
      action: 'IGNORE'
    }
  }

  const _saveResponseMessage = async (
    message: Message,
    state: State,
    responseContent: Content
  ) => {
    const { agentId, userIds, room_id } = message

    responseContent.content = responseContent.content?.trim()

    if (responseContent.content) {
      await runtime.messageManager.createMemory({
        user_ids: userIds!,
        user_id: agentId!,
        content: responseContent,
        room_id,
        embedding: embeddingZeroVector
      })
      await runtime.evaluate(message, { ...state, responseContent })
    } else {
      console.warn('Empty response, skipping')
    }
  }

  console.log('responseContent', responseContent)

  await _saveResponseMessage(message, state, responseContent)
  await runtime.processActions(message, responseContent)

  return responseContent
}

export function shouldSkipMessage (state: State, agentId: string): boolean {
  if (state.recentMessagesData && state.recentMessagesData.length > 2) {
    const currentMessages = state.recentMessagesData ?? []
    const lastThreeMessages = currentMessages.slice(-3)
    const lastThreeMessagesFromAgent = lastThreeMessages.filter(
      (message: Memory) => message.user_id === agentId
    )
    if (lastThreeMessagesFromAgent.length === 3) {
      return true
    }

    const lastTwoMessagesFromAgent = lastThreeMessagesFromAgent.slice(-2)
    const lastTwoMessagesFromAgentWithWaitAction =
      lastTwoMessagesFromAgent.filter(
        (message: Memory) => (message.content as Content).action === 'WAIT'
      )
    if (lastTwoMessagesFromAgentWithWaitAction.length === 2) {
      return true
    }
  }
  return false
}

const onMessage = async (
  message: Message,
  runtime: BgentRuntime,
  state?: State
) => {
  const { content: senderContent, senderId, agentId } = message

  if (!message.userIds) {
    message.userIds = [senderId!, agentId!]
  }

  if (!senderContent) {
    console.warn('Sender content null, skipping')
    return
  }

  const data = (await handleMessage(runtime, message, state)) as Content
  return data
}

interface HandlerArgs {
  req: Request
  env: {
    SUPABASE_URL: string
    SUPABASE_SERVICE_API_KEY: string
    OPENAI_API_KEY: string
    NODE_ENV: string
  }
  match?: RegExpMatchArray
  userId: UUID
  supabase: SupabaseClient
}

class Route {
  path
  handler

  constructor ({
    path = /^/,
    handler
  }: {
    path?: RegExp
    handler: (args: HandlerArgs) => Promise<Response | null | unknown>
  }) {
    this.path = path
    this.handler = handler
  }
}

const routes: Route[] = [
  {
    path: /^\/api\/agents\/message/,
    async handler ({ req, env }: HandlerArgs) {
      if (req.method === 'OPTIONS') {
        return
      }

      const supabase = createClient(
        env.SUPABASE_URL,
        env.SUPABASE_SERVICE_API_KEY,
        {
          auth: {
            persistSession: false
          }
        }
      )

      let token = req.headers.get('Authorization')?.replace('Bearer ', '')
      const message = await req.json()

      // if message.userIds is a string, parse it from json
      if (typeof (message as Message).userIds === 'string') {
        (message as Message).userIds = JSON.parse(
          (message as Message).userIds as unknown as string
        )
      }

      console.log('*** message is', message)

        if (!token && (message as { token: string }).token) {
          token = (message as { token: string }).token
        }

      // check if payload role is 'service_role'
      console.log('token', token)

      const out = (token && jwt.decode(token)) as {
        payload: { sub: string, role: string, id: string }
        id: string
      }

      console.log('out', out)

      let userId = ''
      if (out?.payload?.role !== 'service_role') {
        userId = out?.payload?.sub || out?.payload?.id || out?.id

      if (!userId) {
        return _setHeaders(new Response('Unauthorized', { status: 401 }))
      }

      if (!userId) {
        console.log(
          'Warning, userId is null, which means the token was not decoded properly. This will need to be fixed for security reasons.'
        )
      }
    }

      const runtime = new BgentRuntime({
        debugMode: env.NODE_ENV === 'development',
        serverUrl: 'https://api.openai.com/v1',
        supabase,
        token: env.OPENAI_API_KEY,
        actions: [...actions, ...defaultActions],
        evaluators: [...evaluators, ...defaultEvaluators]
      })

      if (!(message as Message).agentId) {
        return new Response('agentId is required', { status: 400 })
      }

      if (!(message as Message).senderId && userId) {
        (message as Message).senderId = userId as UUID
      }

      if (!(message as Message).userIds) {
        (message as Message).userIds = [
          (message as Message).senderId!,
          (message as Message).agentId!
        ]
      }

      try {
        await onMessage(message as Message, runtime)
      } catch (error) {
        console.error('error', error)
        return new Response(error as string, { status: 500 })
      }

      return new Response('ok', { status: 200 })
    }
  },
  {
    // handle all other paths
    path: /^/,
    async handler ({ req }) {
      return new Response('Not found', { status: 404 })
    }
  }
]

async function handleRequest (
  req: Request,
  env: {
    SUPABASE_URL: string
    SUPABASE_SERVICE_API_KEY: string
    OPENAI_API_KEY: string
    NODE_ENV: string
  }
) {
  const { pathname } = new URL(req.url)

  console.log('pathname', pathname)

  if (req.method === 'OPTIONS') {
    return _setHeaders(
      new Response('', {
        status: 204,
        statusText: 'OK',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': '*',
          'Access-Control-Allow-Headers': '*'
        }
      })
    )
  }

  for (const { path, handler } of routes) {
    const matchUrl = pathname.match(path as RegExp)

    if (matchUrl) {
      try {
        const response = await handler({
          req,
          env,
          match: matchUrl
        })

        return response
      } catch (err) {
        return _setHeaders(new Response(err as string, { status: 500 }))
      }
    }
  }

  return _setHeaders(
    new Response(
      JSON.stringify({ content: 'No handler found for this path' }),
      {
        headers: { 'Content-Type': 'application/json' },
        status: 200
      }
    )
  )
}

export const fetch = async (
  request: Request,
  env: {
    SUPABASE_URL: string
    SUPABASE_SERVICE_API_KEY: string
    OPENAI_API_KEY: string
    NODE_ENV: string
  }
) => {
  try {
    const res = (await handleRequest(request, env)) as Response
    return _setHeaders(res)
  } catch (error) {
    return new Response(JSON.stringify({ error: (error as Error).message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

function _setHeaders (res: Response) {
  const defaultHeaders = [
    {
      key: 'Access-Control-Allow-Origin',
      value: '*'
    },
    {
      key: 'Access-Control-Allow-Methods',
      value: 'GET,PUT,POST,DELETE,PATCH,OPTIONS'
    },
    {
      key: 'Access-Control-Allow-Headers',
      value: '*'
    },
    {
      key: 'Access-Control-Expose-Headers',
      value: '*'
    },
    {
      key: 'Access-Control-Allow-Private-Network',
      value: 'true'
    },
    {
      key: 'Cross-Origin-Opener-Policy',
      value: 'same-origin'
    },
    {
      key: 'Cross-Origin-Embedder-Policy',
      value: 'require-corp'
    },
    {
      key: 'Cross-Origin-Resource-Policy',
      value: 'cross-origin'
    }
  ]

  for (const { key, value } of defaultHeaders) {
    if (!res.headers.has(key)) res.headers.append(key, value)
  }
  return res
}
