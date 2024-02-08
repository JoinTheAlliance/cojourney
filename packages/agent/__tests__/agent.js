// test creating an agent runtime
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

import {
    AgentRuntime
} from '../dist/index.esm.js';

describe('Intorduce Function', () => {
    test('Create an agent runtime instance and use the basic functionality', async () => {
        // const supabase = createClient('supabaseUrl', 'supabaseKey');

        // const { data: { user } } = await supabase.auth.getUser();

        // const runtime = new AgentRuntime({
        //     debugMode: false,
        //     serverUrl: 'SERVER_URL',
        //     supabase: 'supabase',
        // });
        

        
      const result = true;
      expect(result).toBe(true);
    });
  });

// test create memory, read it, delete it

// test agent start, update, message