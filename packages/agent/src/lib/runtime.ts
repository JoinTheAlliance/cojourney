import {SupabaseClient} from '@supabase/supabase-js'
import {MemoryManager} from './memory'
import {defaultActions} from './actions'
import {defaultEvaluators} from './evaluators'
import {Action, Evaluator} from './types'

export type AgentRuntimeOpts = {
  recentMessageCount?: number
  token: string
  supabase: SupabaseClient
  debugMode?: boolean
  serverUrl?: string
}

/**
 * @class AgentRuntime
 * @param {object} opts
 * @param {number} opts.recentMessageCount
 * @param {string} opts.token - JWT token
 * @param {object} opts.supabase - Supabase client
 * @param {boolean} opts.debugMode - If true, will log debug messages
 */
export class AgentRuntime {
  #recentMessageCount = 8
  serverUrl = 'http://localhost:7998'
  token: string | null
  debugMode: boolean
  supabase: SupabaseClient
  messageManager: MemoryManager = new MemoryManager({
    runtime: this,
    tableName: 'messages',
  })
  descriptionManager: MemoryManager = new MemoryManager({
    runtime: this,
    tableName: 'descriptions',
  })
  reflectionManager: MemoryManager = new MemoryManager({
    runtime: this,
    tableName: 'reflections',
  })
  actionHandlers: Action[] = []
  evaluationHandlers: Evaluator[] = []

  constructor(opts: AgentRuntimeOpts) {
    this.#recentMessageCount =
      opts.recentMessageCount || this.#recentMessageCount
    this.debugMode = opts.debugMode || false
    this.supabase = opts.supabase
    this.serverUrl = opts.serverUrl || this.serverUrl
    if (!this.serverUrl) {
      console.warn('No serverUrl provided, defaulting to localhost')
    }

    this.token = opts.token

    defaultActions.forEach((action) => this.registerActionHandler(action))
    defaultEvaluators.forEach((evaluator) =>
      this.registerEvaluationHandler(evaluator)
    )
  }

  getRecentMessageCount() {
    return this.#recentMessageCount
  }

  registerActionHandler(handler: Handler) {
    this.actionHandlers.push(handler)
  }

  getActions() {
    return [...new Set(this.actionHandlers)]
  }

  registerEvaluationHandler(handler: Handler) {
    this.evaluationHandlers.push(handler)
  }

  getEvaluationHandlers() {
    return [...new Set(this.evaluationHandlers)]
  }

  async completion({
    context = '',
    stop = [],
    model = 'gpt-3.5-turbo-0125',
    frequency_penalty = 0.0,
    presence_penalty = 0.0,
  }) {
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        stop,
        model,
        frequency_penalty,
        presence_penalty,
        messages: [
          {
            role: 'user',
            content: context,
          },
        ],
      }),
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

      const content = body.choices?.[0]?.message?.content
      if (!content) {
        throw new Error('No content in response')
      }
      return content
    } catch (error) {
      console.log('e', error)
      throw new Error(error as any)
    }
  }

  async embed(input: string) {
    const embeddingModel = `text-embedding-3-small`
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.token}`,
      },
      body: JSON.stringify({
        input,
        model: embeddingModel,
        dimensions: 768,
      }),
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

      const data = await response.json()
      console.log('embedding data', data)
      return data?.data?.[0].embedding
    } catch (e) {
      console.log('e', e)
      throw e
    }
  }
}

export default AgentRuntime
