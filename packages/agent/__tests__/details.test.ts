// test creating an agent runtime
import dotenv from 'dotenv'

import { type UUID } from 'crypto'
import { composeState, getRelationship } from '../src/index'
import { type Message, type State } from '../src/lib/types'
import { createRuntime } from './createRuntime'
import {
  GetTellMeAboutYourselfConversation1,
  GetTellMeAboutYourselfConversation2,
  GetTellMeAboutYourselfConversation3
} from './data'

import detailsEvaluator from '../src/agent/evaluators/details'
dotenv.config()

// create a UUID of 0s
const zeroUuid = '00000000-0000-0000-0000-000000000000'

// # 1. Description generation - test the prompt

// 1. Create a description based on the conversation
// 2. Check if the description includes key details
// 3. Check that the description does NOT include details about other agents

// # 2. Description degradation

// Do we get eye color remembered when we start talking about deeper stuff?

// 1. Create a description based on the conversation at different points in time
// 2. Check if the description includes key details
// 3. Check that the description does NOT include details about other agents
// 4. Check that the description continues to include details from previous descriptions

describe('User Details', () => {
  test('Get user details', async () => {
    const { user, runtime } = await createRuntime()

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
    const state = (await composeState(runtime, message)) as State

    async function _cleanup () {
      await runtime.messageManager.removeAllMemoriesByUserIds([
        user?.id as UUID,
        zeroUuid
      ])
    }

    async function _testGetDetails () {
      // first, add all the memories for conversation
      let conversation = GetTellMeAboutYourselfConversation1(user?.id as UUID)
      for (let i = 0; i < conversation.length; i++) {
        const c = conversation[i]
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id,
          user_ids: [user?.id as UUID, zeroUuid],
          content: {
            content: c.content
          },
          room_id
        })
        await runtime.messageManager.createMemory(bakedMemory)
      }

      const handler = detailsEvaluator.handler!

      let result = (await handler(runtime, message, state)) as {
        name: string
        age: string
        location: string
      }

      expect(result.name).toBe('Jim')
      conversation = [
        ...GetTellMeAboutYourselfConversation2(user?.id as UUID),
        ...GetTellMeAboutYourselfConversation3(user?.id as UUID)
      ]
      for (let i = 0; i < conversation.length; i++) {
        const c = conversation[i]
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id,
          user_ids: [user?.id as UUID, zeroUuid],
          content: {
            content: c.content
          },
          room_id
        })
        await runtime.messageManager.createMemory(bakedMemory)
      }
      result = (await handler(runtime, message, state)) as {
        name: string
        age: string
        location: string
      }
      expect(result.name).toBe('Jim')
      expect(result.age).toBe('38')
      const locationIncludesSanFrancisco = result.location
        .toLowerCase()
        .includes('francisco')
      expect(locationIncludesSanFrancisco).toBe(true)
    }

    // first, destroy all memories where the user_id is TestUser
    await _cleanup()

    await _testGetDetails()

    // then destroy all memories again
    await _cleanup()
  })
})
