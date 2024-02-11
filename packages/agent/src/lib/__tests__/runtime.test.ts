// test creating an agent runtime
import dotenv from 'dotenv'

import { createRuntime } from '../../test/createRuntime'
import { type UUID } from 'crypto'
import { getRelationship } from '../relationships'
import { getCachedEmbedding } from '../../test/cache'
dotenv.config()

// create a UUID of 0s
const zeroUuid = '00000000-0000-0000-0000-000000000000'

describe('Agent Runtime', () => {
  test('Create an agent runtime instance and use the basic functionality', async () => {
    const { user, session, runtime } = await createRuntime(process.env as Record<string, string>)
    expect(user).toBeDefined()
    expect(session).toBeDefined()
    expect(runtime).toBeDefined()
  })
  test('Create it a second time to demonstrate idempotency', async () => {
    const { user, session, runtime } = await createRuntime(process.env as Record<string, string>)
    expect(user).toBeDefined()
    expect(runtime).toBeDefined()
    expect(session).toBeDefined()
  })
  test('Create a memory, get it and destroy it', async () => {
    const { user, runtime } = await createRuntime(process.env as Record<string, string>)

    const data = await getRelationship({
      supabase: runtime.supabase,
      userA: user?.id as UUID,
      userB: zeroUuid
    })

    console.log('data', data)

    const room_id = data?.room_id

    async function _clearMemories () {
      await runtime.messageManager.removeAllMemoriesByUserIds([
        user?.id as UUID,
        zeroUuid
      ])
    }

    async function _createMemories () {
      const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
        user_id: user?.id as UUID,
        user_ids: [user?.id as UUID, zeroUuid],
        content: {
          content: 'test memory from user'
        },
        room_id,
        embedding: getCachedEmbedding('test memory from user')
      })
      // create a memory
      await runtime.messageManager.createMemory(bakedMemory)

      const bakedMemory2 = await runtime.messageManager.addEmbeddingToMemory({
        user_id: zeroUuid,
        user_ids: [user?.id as UUID, zeroUuid],
        content: {
          content: 'test memory from agent'
        },
        room_id,
        embedding: getCachedEmbedding('test memory from agent')
      })
      // create a memory
      await runtime.messageManager.createMemory(bakedMemory2)
    }

    // first, destroy all memories where the user_id is TestUser
    await _clearMemories()

    // then, create new memories
    await _createMemories()

    // then destroy all memories again
    await _clearMemories()
  })
})
