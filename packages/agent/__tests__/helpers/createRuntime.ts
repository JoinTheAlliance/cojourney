import { createClient } from '@supabase/supabase-js'
import { CojourneyRuntime } from '../../src'

export async function createRuntime () {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!
  )

  // login
  const {
    data: { user, session }
  } = await supabase.auth.signInWithPassword({
    email: process.env.TEST_EMAIL!,
    password: process.env.TEST_PASSWORD!
  })

  if (!session) {
    throw new Error('Session not found')
  }

  const runtime = new CojourneyRuntime({
    debugMode: false,
    serverUrl: 'https://api.openai.com/v1',
    supabase,
    token: process.env.OPENAI_API_KEY!
  })

  return { user, session, runtime }
}
