import { createRuntime, getRelationship, type BgentRuntime, type Message } from 'bgent'
import { type UUID } from 'crypto'
import { config } from 'dotenv'
import {
  getCachedEmbedding,
  writeCachedEmbedding
} from '../../../test/cache'
import { zeroUuid } from '../../../test/constants'
import {
  GetTellMeAboutYourselfConversation1,
  GetTellMeAboutYourselfConversation2,
  GetTellMeAboutYourselfConversation3
} from '../../../test/data'
import evaluator from '../details'

// use .dev.vars for local testing
config({ path: '../../.env' })

describe('User Details', () => {
  test('Get user details', async () => {
    const { user, runtime } = await createRuntime({
      env: process.env as Record<string, string>
    })

    const data = await getRelationship({
      runtime: runtime as unknown as BgentRuntime,
      userA: user?.id as UUID,
      userB: zeroUuid
    })

    const room_id = data?.room_id

    const message: Message = {
      userId: user?.id as UUID,
      content: { content: '' },
      room_id
    }

    //

    async function _cleanup () {
      await runtime.messageManager.removeAllMemoriesByUserIds([
        user?.id as UUID,
        zeroUuid
      ])
    }

    async function _testGetDetails () {
      let conversation = GetTellMeAboutYourselfConversation1(user?.id as UUID)
      for (let i = 0; i < conversation.length; i++) {
        const c = conversation[i]
        const embedding = getCachedEmbedding(c.content.content as string)
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id as UUID,
          content: c.content,
          room_id,
          embedding
        })
        await runtime.messageManager.createMemory(bakedMemory)
        if (!embedding) {
          writeCachedEmbedding(
            c.content.content,
            bakedMemory.embedding as number[]
          )
          await new Promise((resolve) => setTimeout(resolve, 250))
        }
      }

      const handler = evaluator.handler!

      let result = (await handler(runtime as unknown as BgentRuntime, message)) as {
        name: string
        age: string
        gender: string
        location: string
      }

      expect(result.name).toBe('Jim')
      conversation = [
        ...GetTellMeAboutYourselfConversation2(user?.id as UUID),
        ...GetTellMeAboutYourselfConversation3(user?.id as UUID)
      ]
      for (let i = 0; i < conversation.length; i++) {
        const c = conversation[i]
        const embedding = getCachedEmbedding(c.content.content)
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id as UUID,
          content: {
            content: c.content.content
          },
          room_id,
          embedding
        })
        if (!embedding) {
          writeCachedEmbedding(
            c.content.content,
            bakedMemory.embedding as number[]
          )
        }
        await runtime.messageManager.createMemory(bakedMemory)
      }

      result = (await handler(runtime as unknown as BgentRuntime, message)) as {
        name: string
        age: string
        gender: string
        location: string
      }

      expect(result.name).toBe('Jim')
      expect(result.age).toBe(38)
      const locationIncludesSanFrancisco = result.location
        .toLowerCase()
        .includes('francisco')
      expect(locationIncludesSanFrancisco).toBe(true)
    }

    await _cleanup()

    await _testGetDetails()

    await _cleanup()
  }, 60000)
})
