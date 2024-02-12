import { type SupabaseClient } from '@supabase/supabase-js'
import { MemoryManager } from './memory'
import { defaultActions } from './actions'
import { defaultEvaluators } from './evaluation'
import { type Action, type Evaluator } from './types'

export interface AgentRuntimeOpts {
  recentMessageCount?: number
  token: string
  supabase: SupabaseClient
  debugMode?: boolean
  serverUrl?: string
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
  readonly #recentMessageCount = 12 as number
  serverUrl = 'http://localhost:7998'
  token: string | null
  debugMode: boolean
  supabase: SupabaseClient
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

  constructor (opts: AgentRuntimeOpts) {
    this.#recentMessageCount =
      opts.recentMessageCount ?? this.#recentMessageCount
    this.debugMode = opts.debugMode ?? false
    this.supabase = opts.supabase
    this.serverUrl = opts.serverUrl ?? this.serverUrl
    if (!this.serverUrl) {
      console.warn('No serverUrl provided, defaulting to localhost')
    }

    this.token = opts.token

    defaultActions.forEach((action) => {
      this.registerAction(action)
    })
    defaultEvaluators.forEach((evaluator) => {
      this.registerEvaluator(evaluator)
    })
  }

  getRecentMessageCount () {
    return this.#recentMessageCount
  }

  registerAction (action: Action) {
    this.actions.push(action)
  }

  getActions () {
    return [...new Set(this.actions)]
  }

  registerEvaluator (evaluator: Evaluator) {
    this.evaluators.push(evaluator)
  }

  getEvaluationHandlers () {
    return [...new Set(this.evaluators)]
  }

  async completion ({
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

      console.log('body', body)

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

  async embed (input: string) {
    const embeddingModel = 'text-embedding-3-large'
    console.log('embedding input', input)
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
      console.log('requestOptions', requestOptions)
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
}

export default CojourneyRuntime
