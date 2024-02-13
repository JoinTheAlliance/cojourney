import { type SupabaseClient } from '@supabase/supabase-js'
import { type Message } from '../lib/types'
import { defaultActions } from './actions'
import { composeContext } from './context'
import { evaluationTemplate, defaultEvaluators, formatEvaluatorConditions, formatEvaluatorNames, formatEvaluators } from './evaluation'
import logger from './logger'
import { MemoryManager, embeddingZeroVector } from './memory'
import { Content, State, type Action, type Evaluator } from './types'
import { parseJSONObjectFromText, parseJsonArrayFromText } from './utils'
import { composeState } from './state'
import { requestHandlerTemplate } from './templates'
export interface AgentRuntimeOpts {
  recentMessageCount?: number // number of messages to hold in the recent message cache
  token: string // JWT token, can be a JWT token if outside worker, or an OpenAI token if inside worker
  supabase: SupabaseClient // Supabase client
  debugMode?: boolean // If true, will log debug messages
  serverUrl?: string // The URL of the worker
  flavor?: string // Optional lore to inject into the default prompt
  actions?: Action[] // Optional custom actions
  evaluators?: Evaluator[] // Optional custom evaluators
}

/**
 * @class CojourneyRuntime
 * @param {object} opts
 * @param {number} opts.recentMessageCount
 * @param {string} opts.token - JWT token
 * @param {object} opts.supabase - Supabase client
 * @param {boolean} opts.debugMode - If true, will log debug messages
 */
export class CojourneyRuntime {
  readonly #recentMessageCount = 32 as number
  serverUrl = 'http://localhost:7998'
  token: string | null
  debugMode: boolean
  supabase: SupabaseClient
  flavor: string = ''
  messageManager: MemoryManager = new MemoryManager({
    runtime: this,
    tableName: 'messages'
  })

  descriptionManager: MemoryManager = new MemoryManager({
    runtime: this,
    tableName: 'descriptions'
  })

  reflectionManager: MemoryManager = new MemoryManager({
    runtime: this,
    tableName: 'reflections'
  })

  actions: Action[] = []
  evaluators: Evaluator[] = []

  constructor(opts: AgentRuntimeOpts) {
    this.#recentMessageCount =
      opts.recentMessageCount ?? this.#recentMessageCount
    this.debugMode = opts.debugMode ?? false
    this.supabase = opts.supabase
    this.serverUrl = opts.serverUrl ?? this.serverUrl
    this.flavor = opts.flavor ?? ''
    if (!this.serverUrl) {
      console.warn('No serverUrl provided, defaulting to localhost')
    }

    this.token = opts.token

    defaultActions.forEach((action) => {
      this.registerAction(action)
    })

    const actions = opts.actions ?? []
    actions.forEach((action: Action) => {
      if (!this.getActions().includes(action)) {
        this.registerAction(action)
      }
    })

    defaultEvaluators.forEach((evaluator) => {
      this.registerEvaluator(evaluator)
    })

    const evaluators = opts.evaluators ?? []
    evaluators.forEach((evaluator: Evaluator) => {
      if (!this.evaluators.includes(evaluator)) {
        this.evaluators.push(evaluator)
      }
    })
  }

  getRecentMessageCount() {
    return this.#recentMessageCount
  }

  registerAction(action: Action) {
    this.actions.push(action)
  }

  getActions() {
    return [...new Set(this.actions)]
  }

  registerEvaluator(evaluator: Evaluator) {
    this.evaluators.push(evaluator)
  }

  getEvaluationHandlers() {
    return [...new Set(this.evaluators)]
  }

  async completion({
    context = '',
    stop = [],
    model = 'gpt-3.5-turbo-0125',
    frequency_penalty = 0.0,
    presence_penalty = 0.0
  }) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify({
        stop,
        model,
        frequency_penalty,
        presence_penalty,
        messages: [
          {
            role: 'user',
            content: context
          }
        ]
      })
    }

    try {
      const response = await fetch(
        `${this.serverUrl}/chat/completions`,
        requestOptions
      )

      // if response has an error
      if (!response.ok) {
        throw new Error(
          'OpenAI API Error: ' + response.status + ' ' + response.statusText
        )
      }

      const body = await response.json()

      interface OpenAIResponse {
        choices: Array<{ message: { content: string } }>
      }

      const content = (body as OpenAIResponse).choices?.[0]?.message?.content
      if (!content) {
        throw new Error('No content in response')
      }
      return content
    } catch (error) {
      console.log('e', error)
      throw new Error(error as string)
    }
  }

  async embed(input: string) {
    const embeddingModel = 'text-embedding-3-large'
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`
      },
      body: JSON.stringify({
        input,
        model: embeddingModel
      })
    }
    try {
      const response = await fetch(
        `${this.serverUrl}/embeddings`,
        requestOptions
      )

      if (!response.ok) {
        throw new Error(
          'OpenAI API Error: ' + response.status + ' ' + response.statusText
        )
      }

      interface OpenAIEmbeddingResponse {
        data: Array<{ embedding: number[] }>
      }

      const data: OpenAIEmbeddingResponse = await response.json()

      return data?.data?.[0].embedding
    } catch (e) {
      console.log('e', e)
      throw e
    }
  }

  async handleRequest(
    message: Message,
    state?: State
  ) {
    if (!state) {
      state = (await composeState(this, message)) as State
    }
    // compose the text context for message generation
    const context = composeContext({
      state,
      template: requestHandlerTemplate
    })

    if (this.debugMode) {
      logger.log(context, {
        title: 'Response Context',
        frame: true,
        color: 'blue'
      })
    }

    let responseContent
    const { senderId, room_id, userIds: user_ids, agentId } = message

    for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
      const response = await this.completion({
        context,
        stop: []
      })

      // log the response
      await this.supabase
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
        responseContent = parsedResponse
        break
      }
    }

    // return response result to the user
    if (!responseContent) {
      responseContent = "I'm sorry, I don't have a response for that"
    }

    await this.processActions(message, responseContent)
    await this.saveRequestMessage(message, state, responseContent)
    await this.saveResponseMessage(message, state, responseContent)


    return responseContent
  }

  async getValidActions(message: Message) {
    const actionPromises = this.getActions().map(async (action: Action) => {
      if (!action.handler) {
        console.log('no handler')
        return
      }

      const result = await action.validate(this, message)
      if (result) {
        return action
      }
      return null
    })

    const resolvedActions = await Promise.all(actionPromises)
    const actionsData = resolvedActions.filter(Boolean) as Action[]
    return actionsData
  }

  /**
   * Handles the subsequent action execution if the main prompt outputs an action other than WAIT/CONTINUE
   */
  async processActions(
    message: Message,
    data: Content
  ) {
    if (!data.action) {
      return
    }

    const action = this
      .getActions()
      .find((a: { name: string }) => a.name === data.action)!

    if (!action) {
      return // console.warn('No action found for', data.action)
    }

    if (!action.handler) {
      if (this.debugMode) {
        logger.log(`No handler found for action ${action.name}, skipping`, {
          color: 'yellow'
        })
      }
      return
    }

    await action.handler(this, message)
  }

  // helper function to store the request message (sent from user)
  async saveRequestMessage(message: Message, state: State, responseContent: Content) {
    const { content: senderContent, senderId, userIds, room_id } = message

    // TODO: The types here are ugly, log and very this
    const _senderContent = (
      (senderContent as Content).content ?? senderContent
    )?.trim()
    // first, store the sender memory if it exists
    if (_senderContent) {
      await this.messageManager.createMemory({
        user_ids: userIds!,
        user_id: senderId!,
        content: {
          content: _senderContent,
          action: (message.content as Content)?.action ?? 'null'
        },
        room_id,
        embedding: embeddingZeroVector
      })
      await this.evaluate(message, { ...state, responseContent })
    }
  }

  // helper function to store the response message (sent from agent)
  async saveResponseMessage(
    message: Message,
    state: State,
    responseContent: Content
  ) {
    const { agentId, userIds, room_id } = message

    responseContent.content = responseContent.content?.trim()

    if (responseContent.content) {
      await this.messageManager.createMemory({
        user_ids: userIds!,
        user_id: agentId!,
        content: responseContent,
        room_id,
        embedding: embeddingZeroVector
      })
      await this.evaluate(message, { ...state, responseContent })
    } else {
      console.warn('Empty response, skipping')
    }
  }

  async evaluate(
    message: Message,
    state: State
  ) {
    // 3. make sure all the evaluators have conditionals and desciptions
    // 4. write test and validate

    const evaluatorPromises = this.evaluators.map(async (evaluator: Evaluator) => {
      if (!evaluator.handler) {
        console.log('no handler')
        return
      }

      const result = await evaluator.validate(this, message)
      if (result) {
        return evaluator
      }
      return null
    })

    const resolvedEvaluators = await Promise.all(evaluatorPromises)
    const evaluatorsData = resolvedEvaluators.filter(Boolean)

    // format the evaluators
    const evaluators = formatEvaluators(evaluatorsData as Evaluator[])
    const evaluatorNames = formatEvaluatorNames(evaluatorsData as Evaluator[])
    const evaluatorConditions = formatEvaluatorConditions(evaluatorsData as Evaluator[])

    const context = composeContext({
      state: { ...state, evaluators, evaluatorNames, evaluatorConditions },
      template: evaluationTemplate
    })

    const result = await this.completion({
      context
    })

    // parse the result array
    const parsedResult = parseJsonArrayFromText(result)

    this.evaluators
      .filter((evaluator: Evaluator) => evaluator.handler && parsedResult?.includes(evaluator.name))
      .forEach((evaluator: Evaluator) => {
        if (!evaluator?.handler) return

        evaluator.handler(this, message)
      })
  }
}