import { UUID } from 'crypto'
import { AgentRuntime, composeContext, embeddingZeroVector } from '../lib'
import logger from '../lib/logger'
import { composeState } from '../lib/state'
import { Action, Content, Message, State } from '../lib/types'
import {
  parseJSONObjectFromText,
  shouldSkipMessage,
} from '../lib/utils'
import { addCustomActions } from './actions'
import { addCustomEvaluators, evaluate } from './evaluation'
import {
  response_generation_template,
  update_generation_template,
} from './templates'

async function _main(runtime: AgentRuntime, message: Message, state: State, template: string) {
  // compose the text context for message generation
  const context = composeContext({
    state,
    template,
  })

  if (runtime.debugMode) {
    logger.log(context, {
      title: 'Response Context',
      frame: true,
      color: 'blue',
    })
  }

  let responseData
  const {
    senderId,
    room_id,
    userIds: user_ids,
    agentId,
  } = message
  console.log('message', message)


  for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
    console.log('message', message)

    const response = await runtime.completion({ context, stop: [] })
    
    // log the response
    runtime.supabase.from('logs').insert({
      body: { message, context, response },
      user_id: senderId,
      room_id,
      user_ids,
      agent_id: agentId,
      type: 'main_completion'
    }).then(({error}) => {
      if (error) {
        console.error('error', error)
      }
    }
    )

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
async function _processActions(
  runtime: AgentRuntime,
  message: Message,
  state: State,
  data: { action: string }
) {
  if (!data.action) {
    return
  }

  const action = runtime
    .getActions()
    .find((a: { name: string }) => a.name === data.action) as Action

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

  await action.handler(runtime, message, state)
}

// stores either 1 or 2 memories, depending on whether the sender's content is empty or not
async function _storeSenderMemory(
  runtime: AgentRuntime,
  message: Message
) {
  const {
    content: senderContent,
    senderId,
    userIds,
    room_id,
  } = message

  // TODO: The types here are ugly, log and very this
  let _senderContent = (((senderContent as Content).content || senderContent) as string)?.trim()
  // first, store the sender memory if it exists
  if (_senderContent) {
    await runtime.messageManager.createMemory({
      user_ids: userIds as UUID[],
      user_id: senderId as UUID,
      content: { content: _senderContent, action: (message.content as Content)?.action || 'null' },
      room_id,
      embedding: embeddingZeroVector,
    })
  }
}

async function _storeAgentMemory(
  runtime: AgentRuntime,
  message: Message,
  state: State,
  responseData: Content
) {
  const {
    agentId,
    userIds,
    room_id,
  } = message

  responseData.content = responseData.content?.trim()
  if (responseData.content) {
    await runtime.messageManager.createMemory({
      user_ids: userIds as UUID[],
      user_id: agentId as UUID,
      content: responseData,
      room_id,
      embedding: embeddingZeroVector,
    })
    evaluate(runtime, message, { ...state, responseData })
  } else {
    console.warn('Empty response, skipping')
  }
}

// main entry point for the agent
export const onMessage = async (message: Message, runtime: AgentRuntime) => {
  // if runtime.getActions does not include any customActions, add them
  addCustomActions(runtime);
  addCustomEvaluators(runtime);

  let {
    content: senderContent,
    senderId,
    agentId,
    userIds,
  } = message

  // if userIds is not defined, set it to [senderId, agentId]
  if (!userIds) {
    userIds = [senderId as UUID, agentId as UUID]
  }

  if (!senderContent) {
    logger.warn('Sender content null, skipping')
    return
  }

  const state = await composeState(runtime, message) as State

  const data = await _main(runtime, message, state, response_generation_template)
  await _processActions(runtime, message, state, data)
  await _storeSenderMemory(runtime, message)
  await evaluate(runtime, message, { ...state, responseData: data })
  await _storeAgentMemory(runtime, message, state, data)
  await evaluate(runtime, message, { ...state, responseData: data })
}

// main entry point for the agent
export const onUpdate = async (message: Message, runtime: AgentRuntime) => {
  // if runtime.getActions does not include any customActions, add them
  addCustomActions(runtime)

  const {
    agentId,
  } = message

  const state = await composeState(runtime, message)

  if (shouldSkipMessage(state, agentId as UUID)) return

  const data = await _main(runtime, message, state as State, update_generation_template)
  await _processActions(runtime, message, state as State, data)
  await _storeAgentMemory(runtime, message, state as State, data)
  await evaluate(runtime, message, { ...state, responseData: data })
}
