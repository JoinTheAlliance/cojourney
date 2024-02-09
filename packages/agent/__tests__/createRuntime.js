import { createClient } from '@supabase/supabase-js';
import { AgentRuntime } from '../dist/index.esm.js';

export async function createRuntime() {
  const supabase = await createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

  // login
  const { data: { user, session } } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL,
    password: process.env.TEST_PASSWORD,
  });

  const runtime = new AgentRuntime({
    debugMode: false,
    serverUrl: process.env.SERVER_URL,
    supabase,
    token: session.access_token,
  });

  return { user, session, runtime };
}
