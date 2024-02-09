import {AgentRuntime, composeContext, embeddingZeroVector} from '../lib'
import {evaluate} from './evaluations'
import {
  response_generation_template,
  update_generation_template,
} from './templates'
import {
  addCustomActions,
  parseJSONObjectFromText,
  shouldSkipMessage,
} from './utils'
import {composeState} from '../lib/state'
import logger from '@/lib/logger'

async function _main(runtime: AgentRuntime, message: any, state: any, template: any) {
  // compose the text context for message generation
  const context = composeContext({
    context: state,
    template: template,
  })

  if (runtime.debugMode) {
    logger.log(context, {
      title: 'Response Context',
      frame: true,
      color: 'blue',
    })
  }

  let responseData

  for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
    const response = await runtime.completion({context, stop: []})
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

  runtime.sendMessage({
    ...message,
    content: responseData.content,
    action: responseData.action,
  })
  return responseData
}

/**
 * Handles the subsequent action execution if the main prompt outputs an action other than WAIT/CONTINUE
 */
async function _processActions(
  runtime: AgentRuntime,
  _message: any,
  state: any,
  data: {action: any}
) {
  if (!data.action) {
    return
  }

  const action = runtime
    .getActions()
    .find((a: {name: any}) => a.name === data.action)

  if (!action) {
    return // console.warn('No action found for', data.action)
  }

  if (!action.handler) {
    if (runtime.debugMode) {
      logger.log(`No handler found for action ${action.name}, skipping`, {
        color: 'yellow',
      })
    }
    return
  }

  await action.handler(data, state, runtime)
}

// stores either 1 or 2 memories, depending on whether the sender's content is empty or not
async function _storeSenderMemory(
  runtime: AgentRuntime,
  message: any,
  state: any,
  responseData: any
) {
  const {
    content: senderContent,
    senderId,
    eventType,
    userIds,
    room_id,
  } = message

  let _senderContent = senderContent?.trim()
  // first, store the sender memory if it exists
  if (eventType === 'message' && _senderContent) {
    await runtime.messageManager.createMemory({
      user_ids: userIds,
      user_id: senderId,
      content: {content: _senderContent, action: message.action || 'null'},
      room_id,
      embedding: embeddingZeroVector,
    })
  }
}

  async function _storeAgentMemory(
    runtime: AgentRuntime,
    message: any,
    state: any,
    responseData: any
  ) {
    const {
      agentId,
      userIds,
      room_id,
    } = message

  responseData.content = responseData.content?.trim()
  if (responseData.content) {
    await runtime.messageManager.createMemory({
      user_ids: userIds,
      user_id: agentId,
      content: responseData,
      room_id,
      embedding: embeddingZeroVector,
    })
    evaluate(runtime, message, {...state, responseData})
  } else {
    console.warn('Empty response, skipping')
  }
}

// main entry point for the agent
export const onMessage = async (message: any, runtime: AgentRuntime) => {
  // if runtime.getActions does not include any customActions, add them
  addCustomActions(runtime)

  const {
    content: senderContent,
    senderId,
    agentId,
    userIds,
  } = message

  if (!senderContent) {
    logger.warn('Sender content null, skipping')
    return
  }

  const state = await composeState(runtime, userIds, senderId, agentId)

  const data = await _main(runtime, message, state, response_generation_template)
  await _processActions(runtime, message, state, data)
  await _storeSenderMemory(runtime, message, state, data)
  await evaluate(runtime, message, {...state, responseData: data})
  await _storeAgentMemory(runtime, message, state, data)
  await evaluate(runtime, message, {...state, responseData: data})
}

// main entry point for the agent
export const onUpdate = async (message: any, runtime: AgentRuntime) => {
  // if runtime.getActions does not include any customActions, add them
  addCustomActions(runtime)

  const {
    senderId,
    agentId,
    userIds,
  } = message

  const state = await composeState(runtime, userIds, senderId, agentId)

  if (shouldSkipMessage(state, agentId)) return

  const data = await _main(runtime, message, state, update_generation_template)
  await _processActions(runtime, message, state, data)
  await _storeAgentMemory(runtime, message, state, data)
  await evaluate(runtime, message, {...state, responseData: data})
}
