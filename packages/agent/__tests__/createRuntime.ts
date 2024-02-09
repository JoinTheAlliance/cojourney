import { createClient } from '@supabase/supabase-js';
import { AgentRuntime } from '../src';

export async function createRuntime() {
  const supabase = await createClient(process.env.SUPABASE_URL as string, process.env.SUPABASE_ANON_KEY as string);

  // login
  const { data: { user, session } } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL as string,
    password: process.env.TEST_PASSWORD as string,
  });

  const runtime = new AgentRuntime({
    debugMode: false,
    serverUrl: process.env.SERVER_URL,
    supabase,
    token: session?.access_token as string,
  });

  return { user, session, runtime };
}
