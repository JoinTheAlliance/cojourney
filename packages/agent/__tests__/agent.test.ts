// test creating an agent runtime
import dotenv from 'dotenv';
dotenv.config();

import { createRuntime } from './createRuntime';
import { UUID } from 'crypto';

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
      await runtime.messageManager.removeAllMemoriesByUserIds([user?.id as UUID, zeroUuid])
    }

    async function _getRoomId() {
      // TODO: get the room ID
    }

    async function _createMemories() {
      const bakedMemory = await runtime.messageManager.addEmbeddingToMemory({
        user_id: user?.id as UUID,
        user_ids: [user?.id as UUID, zeroUuid],
        content: {
          content: 'test memory from user'
        },
        room_id: _getRoomId()
      })
      // create a memory
      await runtime.messageManager.createMemory(bakedMemory);

      const bakedMemory2 = await runtime.messageManager.addEmbeddingToMemory({
        user_id: zeroUuid,
        user_ids: [user?.id as UUID, zeroUuid],
        content: {
          content: 'test memory from agent'
        },
        room_id: undefined
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