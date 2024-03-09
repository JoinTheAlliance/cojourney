import jwt from '@tsndr/cloudflare-worker-jwt'
import {
  BgentRuntime,
  GoalStatus,
  SupabaseDatabaseAdapter,
  composeContext,
  createGoal,
  defaultActions,
  defaultEvaluators,
  embeddingZeroVector,
  getRelationship,
  messageHandlerTemplate,
  parseJSONObjectFromText,
  type Content,
  type Goal,
  type Memory,
  type Message,
  type State
} from 'bgent'
import { type UUID } from 'crypto'
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
    if ((senderContent as Content).content) {
      // const { data: data2, error } = await runtime.supabase.from('messages').select('*').eq('user_id', message.senderId)
      //   .eq('room_id', room_id)
      //   .order('created_at', { ascending: false })

      // if (error) {
      //   console.log('error', error)
      //   // TODO: dont need this recall
      // } else if (data2.length > 0 && data2[0].content === message.content) {
      //   console.log('already saved', data2)
      // } else {
      //   await runtime.messageManager.createMemory({
      //     user_ids: userIds!,
      //     user_id: senderId!,
      //     content: senderContent,
      //     room_id,
      //     embedding: embeddingZeroVector
      //   })
      // }
      await runtime.evaluate(message, state)
    }
  }

  await _saveRequestMessage(message, state as State)
  // if (!state) {
  state = (await runtime.composeState(message)) as State
  // }

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
    console.log(context)
    const response = await runtime.completion({
      context,
      stop: []
    })

    runtime.databaseAdapter.log({
        body: { message, context, response },
        user_id: senderId,
        room_id,
        user_ids: user_ids!,
        agent_id: agentId!,
        type: 'main_completion'
      })

    const parsedResponse = parseJSONObjectFromText(
      response
    ) as unknown as Content

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

  await _saveResponseMessage(message, state, responseContent)
  runtime.processActions(message, responseContent, state)

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

interface HandlerArgs {
  event: { request: Request, waitUntil: (promise: Promise<unknown>) => void }
  env: {
    SUPABASE_URL: string
    SUPABASE_SERVICE_API_KEY: string
    OPENAI_API_KEY: string
    NODE_ENV: string
  }
  match?: RegExpMatchArray
  userId: UUID
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
    async handler ({ event, env }: HandlerArgs) {
      const req = event.request
      if (req.method === 'OPTIONS') {
        return
      }

      let token = req.headers.get('Authorization')?.replace('Bearer ', '')
      const message = await req.json()

      // if message.userIds is a string, parse it from json
      if (typeof (message as Message).userIds === 'string') {
        (message as Message).userIds = JSON.parse(
          (message as Message).userIds as unknown as string
        )
      }

      if (!token && (message as { token: string }).token) {
        token = (message as { token: string }).token
      }

      const out = (token && jwt.decode(token)) as {
        payload: { sub: string, role: string, id: string }
        id: string
      }

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
        databaseAdapter: new SupabaseDatabaseAdapter(
          env.SUPABASE_URL,
          env.SUPABASE_SERVICE_API_KEY
        ),
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
        event.waitUntil(handleMessage(runtime, message as Message))
      } catch (error) {
        console.error('error', error)
        return new Response(error as string, { status: 500 })
      }

      return new Response('ok', { status: 200 })
    }
  },
  {
    path: /^\/api\/agents\/newuser/,
    async handler ({ event, env }: HandlerArgs) {
      const req = event.request

      if (req.method === 'OPTIONS') {
        return
      }

      let token = req.headers.get('Authorization')?.replace('Bearer ', '')
      const message = await req.json() as { user_id: UUID, token: string }

      if (!token && (message as unknown as { token: string }).token) {
        token = (message as unknown as { token: string }).token
      }

      const out = (token && jwt.decode(token)) as {
        payload: { sub: string, role: string, id: string }
        id: string
      }

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
        databaseAdapter: new SupabaseDatabaseAdapter(
          env.SUPABASE_URL,
          env.SUPABASE_SERVICE_API_KEY
        ),
        token: env.OPENAI_API_KEY,
        actions: [...actions, ...defaultActions],
        evaluators: [...evaluators, ...defaultEvaluators]
      })

      const zeroUuid = '00000000-0000-0000-0000-000000000000' as UUID

      const newMessage = {
        senderId: message.user_id,
        agentId: zeroUuid,
        userIds: [message.user_id, zeroUuid],
        content: { content: '*User has joined Cojourney. Greet them!*', action: 'NEW_USER' }
      } as Message

      const data = await getRelationship({
        runtime,
        userA: message.user_id as UUID,
        userB: zeroUuid
      })

      const room_id = data?.room_id

      const accountData = await runtime.databaseAdapter.getAccountById(message.user_id)

      if (!accountData) {
        return new Response('Account not found', { status: 404 })
      }

      const userName = accountData[0].name || 'the user'

      const newGoal: Goal = {
        name: 'First Time User Introduction (HIGH PRIORITY)',
        status: GoalStatus.IN_PROGRESS,
        user_ids: [message.user_id as UUID, zeroUuid],
        user_id: zeroUuid as UUID,
        objectives: [
          {
            description: `${userName} just joined Cojourney. Greet them and ask them if they are ready to get started.`,
            completed: false
          },
          {
            description: `Get basic details about ${userName}'s age and gender`,
            completed: false
          },
          {
            description: `Get details about ${userName}'s location-- where they live and how far they'd go to meet someone`,
            completed: false
          },
          {
            description: `Get details about ${userName}'s personal life`,
            completed: false
          },
          {
            description: `Get details about ${userName}'s career, school, or work`,
            completed: false
          },
          {
            description: `Get details about ${userName}'s goals for meeting new people: friendly, professional, romantic, personal growth oriented, etc`,
            completed: false
          },
          {
            description: `Let ${userName} know that they can can always chat with CJ to get help with something-- anything!`,
            completed: false
          },
          {
            description: 'Let the user know that CJ has enough information to start making introductions, but they more information they give, the more accurate the introductions will be.',
            completed: false
          }
        ]
      }

      await createGoal({
        runtime,
        goal: newGoal
      })

      await runtime.messageManager.createMemory({
        user_ids: [message.user_id, zeroUuid],
        user_id: message.user_id,
        content: newMessage.content,
        room_id
      })

      event.waitUntil(handleMessage(runtime, newMessage))

      return new Response('ok', { status: 200 })
    }
  },
  {
    // handle all other paths
    path: /^/,
    async handler ({}) {
      return new Response('Not found', { status: 404 })
    }
  }
]

async function handleRequest (
  event: { request: Request, waitUntil: (promise: Promise<unknown>) => void },
  env: Record<string, string>
) {
  const req = event.request as Request
  const { pathname } = new URL(req.url)

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
          event,
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

addEventListener('fetch', event => {
  event.respondWith(handleEvent(event))
})

async function handleEvent (event) {
  try {
    // Call your original request handler and pass the environment variables

    const response = await handleRequest(event as { request: Request, waitUntil: (promise: Promise<unknown>) => void }, {
      // @ts-expect-error - wrangler env variables
      SUPABASE_URL,
      // @ts-expect-error - wrangler env variables
      SUPABASE_SERVICE_API_KEY,
      // @ts-expect-error - wrangler env variables
      OPENAI_API_KEY
    } as Record<string, string>)

    // Return the immediate response to the user
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return _setHeaders(response)
  } catch (error) {
    console.error('Fetch event handler error:', error)
    return new Response('Internal Server Error', { status: 500 })
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
