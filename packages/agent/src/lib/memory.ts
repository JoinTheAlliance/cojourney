import { type UUID } from 'crypto'
import type CojourneyRuntime from './runtime'
import { type Memory } from './types'

export const embeddingDimension = 768
export const embeddingZeroVector = Array(embeddingDimension).fill(0)

const defaultMatchThreshold = 75
const defaultMatchCount = 10

interface SearchOptions {
  match_threshold?: number
  count?: number
  userIds: UUID[]
}

export class MemoryManager {
  runtime: CojourneyRuntime
  tableName: string
  constructor ({
    tableName,
    runtime
  }: {
    tableName: string
    runtime: CojourneyRuntime
  }) {
    this.runtime = runtime
    this.tableName = tableName
  }

  async addEmbeddingToMemory (memory: Memory) {
    const getMemoryEmbeddingString = (memory: Memory) => {
      if (typeof memory.content === 'string') {
        return memory.content
      }
      if (typeof memory.content === 'object' && memory.content !== null) {
        return JSON.stringify(memory.content.content ?? memory.content)
      }
      return ''
    }

    const memoryText = getMemoryEmbeddingString(memory)
    console.log('memoryText', memoryText)
    memory.embedding = memoryText
      ? await this.runtime.embed(memoryText)
      : embeddingZeroVector.slice()
    return memory
  }

  async getMemoriesByIds ({
    userIds,
    count
  }: {
    userIds: UUID[]
    count: number
  }) {
    const result = await this.runtime.supabase.rpc('get_memories', {
      query_table_name: this.tableName,
      query_user_ids: userIds,
      query_count: count
    })
    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }
    if (!result.data) {
      console.warn('data was null, no memories found for', {
        userIds,
        count
      })
      return []
    }
    return result.data
  }

  async searchMemoriesByEmbedding (embedding: number[], opts: SearchOptions) {
    const {
      match_threshold = defaultMatchThreshold,
      count = defaultMatchCount,
      userIds = []
    } = opts

    const result = await this.runtime.supabase.rpc('search_memories', {
      query_table_name: this.tableName,
      query_user_ids: userIds,
      query_embedding: embedding, // Pass the embedding you want to compare
      query_match_threshold: match_threshold, // Choose an appropriate threshold for your data
      query_match_count: count // Choose the number of matches
    })
    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }

    return result.data
  }

  async createMemory (memory: Memory) {
    const result = await this.runtime.supabase
      .from(this.tableName)
      .upsert(memory)
    const { error } = result
    if (error) {
      throw new Error(JSON.stringify(error))
    }
  }

  async removeMemory (memoryId: UUID) {
    // remove item
    const result = await this.runtime.supabase
      .from(this.tableName)
      .delete()
      .eq('id', memoryId)
    const { error } = result
    if (error) {
      throw new Error(JSON.stringify(error))
    }
  }

  async removeAllMemoriesByUserIds (userIds: UUID[]) {
    const result = await this.runtime.supabase.rpc('remove_memories', {
      query_table_name: this.tableName,
      query_user_ids: userIds
    })

    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }
  }

  async removeAllMemoriesByUserId (userId: UUID) {
    const result = await this.runtime.supabase
      .from('memories')
      .delete()
      .eq('user_id', userId)
    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }
  }

  async countMemoriesByUserIds (userIds: UUID[]) {
    const result = await this.runtime.supabase.rpc('count_memories', {
      query_table_name: this.tableName,
      query_user_ids: userIds
    })

    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }

    return result.data
  }
}
