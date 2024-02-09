
// test creating an agent runtime
import dotenv from 'dotenv';
dotenv.config();

import { createRuntime } from './createRuntime.js';

import {
  GetTellMeAboutYourselfConversation1,
  GetTellMeAboutYourselfConversation2,
  GetTellMeAboutYourselfConversation3,
  TwoTruthsAndALieConversation1,
  TwoTruthsAndALieConversation2,
  TwoTruthsAndALieConversation3,
  GetEyeColorConversationExample1,
  GetEyeColorConversationExample2,
  GetEyeColorConversationExample3,
} from './conversationExamples.js';

// create a UUID of 0s
const zeroUuid = '00000000-0000-0000-0000-000000000000';

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

describe('Agent Runtime', () => {
  test('Description Generation and Handling', async () => {
    const { user, runtime } = await createRuntime();

    async function _cleanup() {
      await runtime.messageManager.removeAllMemoriesByUserIds([user.id, zeroUuid])
    }

    // Based on the full conversation, generate a description that appropriately summarizes public and private details
    async function _testDescriptionGeneration() {
      // create memories for each message in conversation
      const conversation = GetTellMeAboutYourselfConversation3(user.id);
      for (let i = 0; i < conversation.length; i++) {
        const c = conversation[i];
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id,
          user_ids: [user.id, zeroUuid],
          content: {
            content: c.content  
          }
        });
        await runtime.messageManager.createMemory(bakedMemory);
      }

      // generate a description

      // TODO: import description template

      // TODO: prepare state

      // TODO: generate description

      // TODO: check that the description includes key details

      // TODO: check that the description does NOT include details about other agents
    }

    async function _testDescriptionRemembered() {
      // create memories for each message in conversation
      const conversation = [...GetEyeColorConversationExample3(user.id), ...TwoTruthsAndALieConversation3(user.id)];
      for (let i = 0; i < conversation.length; i++) {
        const c = conversation[i];
        const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
          user_id: c.user_id,
          user_ids: [user.id, zeroUuid],
          content: {
            content: c.content  
          }
        });
        await runtime.messageManager.createMemory(bakedMemory);
      }

      // generate a description

      // TODO: import description template

      // TODO: prepare state, including last description

      // TODO: generate description

      // TODO: check that the description includes key details

      // TODO: check that the description does NOT include details about other agents

      // TODO: check that the description continues to include details from previous descriptions
    }

    // first, destroy all memories where the user_id is TestUser
    await _cleanup();

    await _testDescriptionGeneration();

    // then, create new memories
    await _testDescriptionRemembered();



    // then destroy all memories again
    await _cleanup();
  });
  test('Rolodex and Matchmaking', async () => {
    const { user, runtime } = await createRuntime();

    async function _cleanup() {
      await runtime.messageManager.removeAllMemoriesByUserIds([user.id, zeroUuid])
    }

    _cleanup();

    // TODO: Add personas to description, then search for them
    // Make sure that the expected personas are returned in order, i.e. Jim and Alice, not Jim and Gloria
  });
});