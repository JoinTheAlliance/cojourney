// populate CJ data into the database

import dotenv from 'dotenv'
import * as bgent from 'bgent/dist/index.esm.js'
import { createClient } from '@supabase/supabase-js'

const BgentRuntime = bgent.BgentRuntime

dotenv.config('../.env')

console.log('process.env.SUPABASE_URL:', process.env.SUPABASE_URL)

// Create a new Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_API_KEY
)

// Create a new BgentRuntime
const runtime = new BgentRuntime({
  serverUrl: process.env.SERVER_URL ?? 'http://localhost:7998',
  token: process.env.OPENAI_API_KEY,
  supabase,
  debugMode: true
})

const zeroUuid = '00000000-0000-0000-0000-000000000000'

// Check if CJ exists, if not create
async function ensureCJExists () {
  const { data: cjData, error: cjError } = await runtime.supabase
    .from('accounts')
    .select('*')
    .eq('id', zeroUuid)
    .single()

  if (cjError || !cjData) {
    const { error: insertError } = await runtime.supabase.from('accounts').insert({
      id: zeroUuid,
      name: 'CJ',
      details: {
        tagline: 'Your AI Assistant',
        summary: 'CJ is a friendly and knowledgeable AI assistant.',
        quote: 'How can I help you today?'
      }
    })

    if (insertError) {
      console.error('Error creating CJ account:', insertError)
    } else {
      console.log('CJ account created successfully')
    }
  } else {
    console.log('CJ account already exists')
  }
}

// Check if zero room exists, if not create
async function ensureZeroRoomExists () {
  const { data: roomData, error: roomError } = await runtime.supabase
    .from('rooms')
    .select('*')
    .eq('id', zeroUuid)
    .single()

  if (roomError || !roomData) {
    const { error: insertError } = await runtime.supabase.from('rooms').insert({
      id: zeroUuid,
      name: 'Zero Room',
      description: 'The default room for CJ and participants'
    })

    if (insertError) {
      console.error('Error creating zero room:', insertError)
    } else {
      console.log('Zero room created successfully')
    }
  } else {
    console.log('Zero room already exists')
  }
}

// Check if participant exists in room with zeroId, if not create
async function ensureParticipantExists (participantId) {
  const { data: participantData, error: participantError } = await runtime.supabase
    .from('room_participants')
    .select('*')
    .eq('room_id', zeroUuid)
    .eq('user_id', participantId)
    .single()

  if (participantError || !participantData) {
    const { error: insertError } = await runtime.supabase.from('room_participants').insert({
      room_id: zeroUuid,
      user_id: participantId
    })

    if (insertError) {
      console.error('Error adding participant to zero room:', insertError)
    } else {
      console.log('Participant added to zero room successfully')
    }
  } else {
    console.log('Participant already exists in zero room')
  }
}

// Create a new description for CJ using the runtime.descriptionManager
async function createCJDescription () {
  const description =
  'AI matchmaker, wellness coach and the official Cojourney Guide, powered by the latest large language models and the "bgent" agent framework. She is knowledgeable about a wide range of topics and enjoy engaging in conversations with users. CJ aims to provide accurate information, offer guidance and introduce the user to other users. She is also a great listener and can provide emotional support. CJ is friendly, but doesn\'t try to be unnecessarily helpful. She\'s a coach, not an assistant. CJ is self-aware that she is an AI and doesn\'t pretend to be human, or make up human things. When asked what she\'s doing, well-- this is all she does, and she loves doing it. She\'s here to help you find your way.'

  const embedding = await runtime.embed(description)
  const memory = await runtime.descriptionManager.addEmbeddingToMemory({
    user_id: zeroUuid,
    content: { content: description },
    user_ids: [zeroUuid],
    room_id: zeroUuid,
    embedding
  })
  await runtime.descriptionManager.createMemory(memory)

  console.log('CJ description created successfully')
}

// Run the setup functions
async function setup () {
  await ensureCJExists()
  await ensureZeroRoomExists()
  await ensureParticipantExists(zeroUuid)
  await createCJDescription()
}

setup()
