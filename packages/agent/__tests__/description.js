// # 1. Description generation - test the prompt

// 1. Generate conversation with some specific key details, for example the user has blue eyes.
// 2. Create a description based on the conversation
// 3. Check if the description includes key details
// 4. Check that the descriptoin does NOT include details about other agents

// # 2. Description volition (*when* to create the description)

// 1. Generate several conversations and sections of conversation
// 2. Evaluate each section and whether agent did or didn't create a description
// 3. What are the 

// test creating an agent runtime
import dotenv from 'dotenv';
dotenv.config();

import { createRuntime } from './createRuntime.js';

// create a UUID of 0s
const zeroUuid = '00000000-0000-0000-0000-000000000000';

describe('Agent Runtime', () => {
  test('Create an agent runtime instance and use the basic functionality', async () => {
    const { user, session, runtime } = await createRuntime();
    expect(user).toBeDefined();
    expect(session).toBeDefined();
    expect(runtime).toBeDefined();
  });
  test('Create it a second time to demonstrate idempotency', async () => {
    const { user, session,  runtime } = await createRuntime();
    expect(user).toBeDefined();
    expect(runtime).toBeDefined();
    expect(session).toBeDefined();
  });
  test('Create a memory, get it and destroy it', async () => {
    const { user, runtime } = await createRuntime();

    async function _clearMemories() {
      await runtime.messageManager.removeAllMemoriesByUserIds([user.id, zeroUuid])
    }

    async function _createMemories() {
      const bakedMemory = runtime.messageManager.addEmbeddingToMemory({
        user_id: user.id,
        user_ids: [user.id, zeroUuid],
        content: {
          content: 'test memory from user'
        }
      })
      // create a memory
      await runtime.messageManager.createMemory(bakedMemory);

      const bakedMemory2 = runtime.messageManager.addEmbeddingToMemory({
        user_id: zeroUuid,
        user_ids: [user.id, zeroUuid],
        content: {
          content: 'test memory from agent'
        }
      })
      // create a memory
      await runtime.messageManager.createMemory(bakedMemory2);
    }

    // first, destroy all memories where the user_id is TestUser
    await _clearMemories();

    // then, create new memories
    await _createMemories();

    // then destroy all memories again
    await _clearMemories();
  });
});