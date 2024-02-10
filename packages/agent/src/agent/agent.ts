import {
  composeContext,
  embeddingZeroVector,
  type CojourneyRuntime
} from '../lib'
import logger from '../lib/logger'
import { composeState } from '../lib/state'
import { type Content, type Message, type State } from '../lib/types'
import { parseJSONObjectFromText, shouldSkipMessage } from '../lib/utils'
import { addCustomActions } from './actions'
import { addCustomEvaluators, evaluate } from './evaluation'
import {
  response_generation_template,
  update_generation_template
} from './templates'

async function _main (
  runtime: CojourneyRuntime,
  message: Message,
  state: State,
  template: string
) {
  // compose the text context for message generation
  const context = composeContext({
    state,
    template
  })

  if (runtime.debugMode) {
    logger.log(context, {
      title: 'Response Context',
      frame: true,
      color: 'blue'
    })
  }

  let responseData
  const { senderId, room_id, userIds: user_ids, agentId } = message
  console.log('message', message)

  for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
    console.log('message', message)

    const response = await runtime.completion({
      context,
      stop: []
    })

    // log the response
    await runtime.supabase
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

    const parsedResponse = parseJSONObjectFromText(response)
    if (parsedResponse?.user?.includes(state.agentName)) {
      responseData = parsedResponse
      break
    }
  }

  // return response result to the user
  if (!responseData) {
    throw new Error('No response generated')
  }
  if (!responseData) return

  return responseData
}

/**
 * Handles the subsequent action execution if the main prompt outputs an action other than WAIT/CONTINUE
 */
async function _processActions (
  runtime: CojourneyRuntime,
  message: Message,
  state: State,
  data: Content
) {
  if (!data.action) {
    return
  }

  const action = runtime
    .getActions()
    .find((a: { name: string }) => a.name === data.action)!

  if (!action) {
    return // console.warn('No action found for', data.action)
  }

  if (!action.handler) {
    if (runtime.debugMode) {
      logger.log(`No handler found for action ${action.name}, skipping`, {
        color: 'yellow'
      })
    }
    return
  }

  await action.handler(runtime, message, state)
}

// stores either 1 or 2 memories, depending on whether the sender's content is empty or not
async function _storeSenderMemory (runtime: CojourneyRuntime, message: Message) {
  const { content: senderContent, senderId, userIds, room_id } = message

  // TODO: The types here are ugly, log and very this
  const _senderContent = (
    (senderContent as Content).content ?? senderContent
  )?.trim()
  // first, store the sender memory if it exists
  if (_senderContent) {
    await runtime.messageManager.createMemory({
      user_ids: userIds!,
      user_id: senderId!,
      content: {
        content: _senderContent,
        action: (message.content as Content)?.action ?? 'null'
      },
      room_id,
      embedding: embeddingZeroVector
    })
  }
}

async function _storeAgentMemory (
  runtime: CojourneyRuntime,
  message: Message,
  state: State,
  responseData: Content
) {
  const { agentId, userIds, room_id } = message

  responseData.content = responseData.content?.trim()

  if (responseData.content) {
    await runtime.messageManager.createMemory({
      user_ids: userIds!,
      user_id: agentId!,
      content: responseData,
      room_id,
      embedding: embeddingZeroVector
    })
    await evaluate(runtime, message, { ...state, responseData })
  } else {
    console.warn('Empty response, skipping')
  }
}

// main entry point for the agent
export const onMessage = async (
  message: Message,
  runtime: CojourneyRuntime
) => {
  // if runtime.getActions does not include any customActions, add them
  addCustomActions(runtime)
  addCustomEvaluators(runtime)

  const { content: senderContent, senderId, agentId } = message

  // if userIds is not defined, set it to [senderId, agentId]
  if (!message.userIds) {
    message.userIds = [senderId!, agentId!]
  }

  if (!senderContent) {
    logger.warn('Sender content null, skipping')
    return
  }

  const state = (await composeState(runtime, message)) as State

  const data = (await _main(
    runtime,
    message,
    state,
    response_generation_template
  )) as Content
  await _processActions(runtime, message, state, data)
  await _storeSenderMemory(runtime, message)
  await evaluate(runtime, message, { ...state, responseData: data })
  await _storeAgentMemory(runtime, message, state, data)
  await evaluate(runtime, message, { ...state, responseData: data })
}

// main entry point for the agent
export const onUpdate = async (message: Message, runtime: CojourneyRuntime) => {
  // if runtime.getActions does not include any customActions, add them
  addCustomActions(runtime)

  const { agentId } = message

  const state = await composeState(runtime, message)

  if (shouldSkipMessage(state as State, agentId!)) return

  const data = (await _main(
    runtime,
    message,
    state as State,
    update_generation_template
  )) as Content
  await _processActions(runtime, message, state as State, data)
  await _storeAgentMemory(runtime, message, state as State, data)
  await evaluate(runtime, message, { ...state, responseData: data } as State)
}
