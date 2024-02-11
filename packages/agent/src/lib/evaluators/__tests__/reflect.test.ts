// test creating an agent runtime
import dotenv from 'dotenv-flow'

import { type UUID } from 'crypto'
import { getRelationship } from '../../relationships'
import { composeState } from '../../state'
import { type Message } from '../../types'
import { createRuntime } from '../../../test/createRuntime'
import {
  GetTellMeAboutYourselfConversation1,
  GetTellMeAboutYourselfConversation2,
  GetTellMeAboutYourselfConversation3,
  jimFacts
} from '../../../test/data'

import evaluator from '../reflect'
import { getCachedEmbedding } from '../../../test/cache'
dotenv.config()

// create a UUID of 0s
const zeroUuid = '00000000-0000-0000-0000-000000000000'

describe('User Profile', () => {
  test('Get user profile', async () => {
    const { user, runtime } = await createRuntime(process.env as Record<string, string>)

    const data = await getRelationship({
      supabase: runtime.supabase,
      userA: user?.id as UUID,
      userB: zeroUuid
    })

    const room_id = data?.room_id

    const message: Message = {
      senderId: user?.id as UUID,
      agentId: zeroUuid,
      userIds: [user?.id as UUID, zeroUuid],
      content: '',
      room_id
    }

    //

    async function _cleanup () {
      await runtime.messageManager.removeAllMemoriesByUserIds([
        user?.id as UUID,
        zeroUuid
      ])
    }

    async function _testCreateProfile () {
      // first, add all the memories for conversation
      let conversation = GetTellMeAboutYourselfConversation1(user?.id as UUID)
      for (let i = 0; i < conversation.length; i++) {
        const c = conversation[i]
        console.log('c is', c)
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id as UUID,
          user_ids: [user?.id as UUID, zeroUuid],
          content: {
            content: c.content
          },
          room_id,
          embedding: getCachedEmbedding(c.content)
        })
        await runtime.messageManager.createMemory(bakedMemory)
        // wait for .2 seconds
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      const handler = evaluator.handler!

      let result = (await handler(runtime, message)) as string[]

      let resultConcatenated = result.join('\n')

      expect(resultConcatenated.includes('programmer')).toBe(true)

      expect(resultConcatenated.includes('Jim')).toBe(true)

      expect(resultConcatenated.toLowerCase().includes('startup')).toBe(true)

      conversation = [
        ...GetTellMeAboutYourselfConversation2(user?.id as UUID),
        ...GetTellMeAboutYourselfConversation3(user?.id as UUID)
      ]
      for (let i = 0; i < conversation.length; i++) {
        const c = conversation[i]
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id as UUID,
          user_ids: [user?.id as UUID, zeroUuid],
          content: {
            content: c.content
          },
          room_id,
          embedding: getCachedEmbedding(c.content)
        })
        await runtime.messageManager.createMemory(bakedMemory)
      }

      // for each fact in jimFacts, add it to the memory
      for (let i = 0; i < jimFacts.length; i++) {
        const c = jimFacts[i]
        const bakedMemory =
          await runtime.reflectionManager.addEmbeddingToMemory({
            user_id: user?.id as UUID,
            user_ids: [user?.id as UUID, zeroUuid],
            content: c,
            room_id,
            embedding: getCachedEmbedding(c)
          })
        await runtime.reflectionManager.createMemory(bakedMemory)
        // wait for .2 seconds
        await new Promise((resolve) => setTimeout(resolve, 200))
      }

      // first just compose state and verify that relevant reflections are being returned

      // Then verify that no relevant reflections and recent reflections match

      const state = await composeState(runtime, message)

      expect(state.recentReflectionsData.length).toBeGreaterThan(0)

      expect(state.relevantReflectionsData.length).toBeGreaterThan(0)

      result = (await handler(runtime, message)) as string[]

      resultConcatenated = result.join('\n')

      // check to make sure we arent getting the same reflections
      expect(resultConcatenated.includes('38')).toBe(false)

      expect(resultConcatenated.toLowerCase().includes('francisco')).toBe(
        false
      )

      expect(resultConcatenated.toLowerCase().includes('startup')).toBe(false)
    }

    // first, destroy all memories where the user_id is TestUser
    await _cleanup()

    await _testCreateProfile()

    // then destroy all memories again
    await _cleanup()
  }, 60000)
})
