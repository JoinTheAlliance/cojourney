import AgentRuntime from './runtime'

export const embeddingDimension = 768;
export const embeddingZeroVector = Array(embeddingDimension).fill(0)

const defaultMatchThreshold = 75
const defaultMatchCount = 10

export class Memory {
  embedding?: any[]
  user_ids?: any
  content?: any
  id?: any
  user_id?: any
  created_at?: any
  room_id: any

  constructor(opts: {
    id?: any
    user_id: any
    created_at?: any
    content: any
    embedding?: any
    user_ids: any
    room_id: any
  }) {
    this.embedding = embeddingZeroVector
    this.user_ids = opts?.user_ids ?? []
    this.content = opts?.content ?? ''
    this.id = opts?.id ?? ''
    this.user_id = opts?.user_id ?? ''
    this.user_ids = opts?.user_ids ?? []
    this.created_at = opts?.created_at ?? new Date()
    this.room_id = opts?.room_id ?? ''
  }

  toJSON() {
    const {
      id,
      user_id,
      content,
      created_at,
      embedding,
      user_ids,
      room_id,
    } = this
    const obj = {
      user_id,
      room_id,
      content,
      embedding,
      created_at,
      user_ids,
    }
    if(id) {
      return {...obj, id}
    }
    return obj
  }
}

//

export class MemoryManager {
  runtime: AgentRuntime
  schema: any
  constructor({
    schema, // Schema
    runtime, // AgentRuntime
  }: {
    schema: any
    runtime: AgentRuntime
  }) {
    this.runtime = runtime
    this.schema = schema
  }

  async bakeMemory(memory: {embedding: any}) {
    const getMemoryEmbeddingString = (memory: Memory) => {
      const json = memory.toJSON()
      if (typeof json?.content === 'string') {
        return json.content
      }
      if (typeof json?.content === 'object' && json?.content !== null) {
        return JSON.stringify(json.content)
      }
      return ''
    }

    const memoryText = getMemoryEmbeddingString(memory as any)
    memory.embedding = memoryText
      ? await this.runtime.embed(memoryText)
      : embeddingZeroVector.slice()
    return memory
  }

  async getMemoriesByIds({
    userIds,
    count,
  }: {
    userIds: any
    count: any
  }) {
    const result = await this.runtime.supabase.rpc('get_memories', {
      query_table_name: this.schema.tableName,
      query_user_ids: userIds,
      query_count: count,
    })
    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }
    if (!result.data) {
      console.warn('data was null, no memories found for', {
        userIds,
        count,
      })
      return [];
    }
    const memories = this.#formatMemories(result.data)
    return memories
  }

  #formatMemories(dbMemories: any[]) {
    return (
      dbMemories?.map((dbMemory: any) => this.#formatMemory(dbMemory)) ?? []
    )
  }

  #formatMemory(dbMemory: {
    id: any
    user_id: any
    content: any
    name: any
    embedding: any
    created_at: any
    user_ids: any
    room_id: any
  }) {
    const {
      id,
      user_id,
      content,
      embedding,
      created_at,
      user_ids,
      room_id,
    } = dbMemory
    return new Memory({
      id,
      user_id,
      content,
      created_at,
      embedding,
      user_ids,
      room_id,
    })
  }

  async searchMemoriesByEmbedding(embedding: any, opts: any = {}) {
    const {
      match_threshold = defaultMatchThreshold,
      match_count = defaultMatchCount,
      userIds = [],
    } = opts
    const result = await this.runtime.supabase.rpc('search_memories', {
      query_table_name: this.schema.tableName,
      query_user_ids: userIds,
      query_embedding: embedding, // Pass the embedding you want to compare
      query_match_threshold: match_threshold, // Choose an appropriate threshold for your data
      query_match_count: match_count, // Choose the number of matches
    })
    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }

    const memories = this.#formatMemories(result.data)
    return memories
  }

  async upsertRawMemory(rawMemory: any) {
    const {tableName} = this.schema
    const result = await this.runtime.supabase.from(tableName).upsert(rawMemory)
    const {error} = result
    if (error) {
      throw new Error(JSON.stringify(error))
    }
  }

  async removeMemory(memoryId: any) {
    const {tableName} = this.schema

    // remove item
    const result = await this.runtime.supabase
      .from(tableName)
      .delete()
      .eq('id', memoryId)
    const {error} = result
    if (error) {
      throw new Error(JSON.stringify(error))
    }
  }

  async countMemoriesByUserIds({userIds}: {userIds: any}) {
    const result = await this.runtime.supabase.rpc('count_memories', {
      query_table_name: this.schema.tableName,
      query_user_ids: userIds,
    })

    if (result.error) {
      throw new Error(JSON.stringify(result.error))
    }

    return result.data
  }
}
