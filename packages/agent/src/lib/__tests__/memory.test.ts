// memory.test.ts

import { type User } from '@supabase/supabase-js'
import { type UUID } from 'crypto'
import dotenv from 'dotenv'
import { createRuntime } from '../../test/createRuntime'
import { MemoryManager } from '../memory'
import { getRelationship } from '../relationships'
import { type Content, type Memory } from '../types'
import { getCachedEmbedding } from '../../test/cache'

dotenv.config()

describe('MemoryManager', () => {
  let memoryManager: MemoryManager
  const zeroUuid: UUID = '00000000-0000-0000-0000-000000000000'
  let runtime = null
  let user: User | null = null
  let room_id: UUID | null = null

  // Setup before all tests
  beforeAll(async () => {
    const result = await createRuntime(process.env as Record<string, string>)
    runtime = result.runtime
    user = result.user

    const data = await getRelationship({
      supabase: runtime.supabase,
      userA: user?.id as UUID,
      userB: zeroUuid
    })

    room_id = data?.room_id

    memoryManager = new MemoryManager({
      tableName: 'messages', // Adjust based on your actual table name
      runtime
    })
  })

  // Cleanup after all tests
  afterAll(async () => {
    await memoryManager.removeAllMemoriesByUserIds([
      user?.id as UUID,
      zeroUuid
    ])
  })

  test('Memory lifecycle: create, search, count, and remove', async () => {
    // Create a test memory
    const testMemory: Memory = await memoryManager.addEmbeddingToMemory(
        {
            user_id: user?.id as UUID,
            content: { content: 'Test content for memory lifecycle' },
            user_ids: [user?.id as UUID, zeroUuid],
            room_id: room_id as UUID,
            embedding: getCachedEmbedding('Test content for memory lifecycle')
          }
    )
    await memoryManager.createMemory(testMemory)

    const createdMemories = await memoryManager.getMemoriesByIds({
      userIds: [user?.id as UUID, zeroUuid],
      count: 100
    })

    // Verify creation by counting memories
    const initialCount = await memoryManager.countMemoriesByUserIds([
      user?.id as UUID,
      zeroUuid
    ])
    expect(initialCount).toBeGreaterThan(0)

    // Search memories by embedding
    const searchedMemories = await memoryManager.searchMemoriesByEmbedding(
        testMemory.embedding!,
      {
        userIds: [user?.id as UUID, zeroUuid],
        count: 5
      }
    )
    expect(searchedMemories.length).toBeGreaterThan(0)

    // Remove a specific memory
    await memoryManager.removeMemory(createdMemories[0].id!)
    const afterRemovalCount = await memoryManager.countMemoriesByUserIds([
      user?.id as UUID
    ])
    expect(afterRemovalCount).toBeLessThan(initialCount)

    // Remove all memories for the test user
    await memoryManager.removeAllMemoriesByUserIds([user?.id as UUID])
    const finalCount = await memoryManager.countMemoriesByUserIds([
      user?.id as UUID,
      zeroUuid
    ])
    expect(finalCount).toEqual(0)
  })
})
describe('MemoryManager - Extended Tests', () => {
  let memoryManager: MemoryManager
  const zeroUuid: UUID = '00000000-0000-0000-0000-000000000000'
  let runtime = null
  let user: User | null = null
  let room_id: UUID | null = null

  beforeAll(async () => {
    const result = await createRuntime(process.env as Record<string, string>)
    runtime = result.runtime
    user = result.user

    const data = await getRelationship({
      supabase: runtime.supabase,
      userA: user?.id as UUID,
      userB: zeroUuid
    })

    room_id = data?.room_id

    memoryManager = new MemoryManager({
      tableName: 'messages',
      runtime
    })
  })

  beforeEach(async () => {
    await memoryManager.removeAllMemoriesByUserIds([
      user?.id as UUID,
      zeroUuid
    ])
  })

  afterAll(async () => {
    await memoryManager.removeAllMemoriesByUserIds([
      user?.id as UUID,
      zeroUuid
    ])
  })

  test('Search memories by embedding similarity', async () => {
    // Define a base memory and two additional memories, one similar and one dissimilar
    const baseMemoryContent = 'Base memory content for testing similarity'
    const similarMemoryContent = 'Base memory content for testing similarity - Similar memory content to the base memory'
    const dissimilarMemoryContent = 'Dissimilar memory content, not related'

    // Create and add embedding to the base memory
    const baseMemory = await memoryManager.runtime.embed(baseMemoryContent)

    // Create and add embedding to the similar and dissimilar memories
    const similarMemory = await memoryManager.addEmbeddingToMemory({
      user_id: user?.id as UUID,
      content: { content: similarMemoryContent },
      user_ids: [user?.id as UUID, zeroUuid],
      room_id: room_id as UUID,
      embedding: getCachedEmbedding(similarMemoryContent)
    })
    await memoryManager.createMemory(similarMemory)

    const dissimilarMemory = await memoryManager.addEmbeddingToMemory({
      user_id: user?.id as UUID,
      content: { content: dissimilarMemoryContent },
      user_ids: [user?.id as UUID, zeroUuid],
      room_id: room_id as UUID,
      embedding: getCachedEmbedding(dissimilarMemoryContent)
    })
    await memoryManager.createMemory(dissimilarMemory)

    // Search for memories similar to the base memory
    const searchedMemories = await memoryManager.searchMemoriesByEmbedding(
      baseMemory!,
      {
        userIds: [user?.id as UUID, zeroUuid],
        count: 1
      }
    )

    // Check that the similar memory is included in the search results and the dissimilar one is not or ranks lower
    expect(
      searchedMemories.some(
        (memory) => (memory.content as Content).content === similarMemoryContent
      )
    ).toBe(true)
    expect(
      searchedMemories.some(
        (memory) =>
          (memory.content as Content).content === dissimilarMemoryContent
      )
    ).toBe(false)
  })

  test('Verify memory similarity and ranking', async () => {
    // Define a set of memories with varying degrees of similarity
    const queryMemoryContent = 'High similarity content to the query memory'
    const highSimilarityContent = 'High similarity content to the query memory'
    const lowSimilarityContent = 'Low similarity content compared to the query'

    // Create and add embedding to the query memory
    const queryMemory = await memoryManager.addEmbeddingToMemory({
      user_id: user?.id as UUID,
      content: { content: queryMemoryContent },
      user_ids: [user?.id as UUID, zeroUuid],
      room_id: room_id as UUID,
      embedding: getCachedEmbedding(queryMemoryContent)
    })
    await memoryManager.createMemory(queryMemory)

    // Create and add embedding to the high and low similarity memories
    const highSimilarityMemory = await memoryManager.addEmbeddingToMemory({
      user_id: user?.id as UUID,
      content: { content: highSimilarityContent },
      user_ids: [user?.id as UUID, zeroUuid],
      room_id: room_id as UUID,
      embedding: getCachedEmbedding(highSimilarityContent)
    })
    await memoryManager.createMemory(highSimilarityMemory)

    const lowSimilarityMemory = await memoryManager.addEmbeddingToMemory({
      user_id: user?.id as UUID,
      content: { content: lowSimilarityContent },
      user_ids: [user?.id as UUID, zeroUuid],
      room_id: room_id as UUID,
      embedding: getCachedEmbedding(lowSimilarityContent)
    })
    await memoryManager.createMemory(lowSimilarityMemory)

    // Search for memories similar to the query memory
    const searchedMemories = await memoryManager.searchMemoriesByEmbedding(
      queryMemory.embedding!,
      {
        userIds: [user?.id as UUID, zeroUuid],
        count: 10
      }
    )

    // Check that the high similarity memory ranks higher than the low similarity memory
    const highSimilarityIndex = searchedMemories.findIndex(
      (memory) => (memory.content as Content).content === highSimilarityContent
    )
    const lowSimilarityIndex = searchedMemories.findIndex(
      (memory) => (memory.content as Content).content === lowSimilarityContent
    )

    expect(highSimilarityIndex).toBeLessThan(lowSimilarityIndex)
  })
})
