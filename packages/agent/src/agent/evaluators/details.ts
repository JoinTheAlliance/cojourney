// - Gather general information about the user

// - Info we want:

// Basics / Logistics
//     - Name
//     - Gender
//     - Age
//     - Location

// Deeper
//     - What is important to you in a connection?
//     - Describe the best aspects of your best connection.
//     - Describe what went well and what went poorly.
//     - How much do they value interests and hobbies vs other things

import { parseJSONObjectFromText } from '../../lib/utils'
import { composeContext } from '../../lib/context'
import { type CojourneyRuntime, getRelationship } from '../../lib'
import { type Evaluator, type Message, type State } from '../../lib/types'
import { type UUID } from 'crypto'

const template = `You are collecting details about {{senderName}} based on their ongoing conversation with {{agentName}}.

Recent conversation:
{{recentConversation}}

Using the most recent conversation, get the details for the user's name, age, location and gender.
Only include the values that can be extracted from the conversation.
Then respond with a JSON object containing a field for description in a JSON block formatted for markdown with this structure:
\`\`\`json
{ user: {{senderName}}, name?: string, age?: number, location?: string, gender?: string}
\`\`\`

Your response must include the JSON block.`

const handler = async (
  runtime: CojourneyRuntime,
  _message: Message,
  state: State
) => {
  //
  console.log('running details handler')
  // TODO:
  // get the target from the message

  // then, search for the user in the actors

  // then inject their profile

  const context = composeContext({
    state,
    template
  })

  let responseData = null

  for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
    // generate the response
    const response = await runtime.completion({
      context,
      stop: []
    })

    // parse the response, which is a json object block
    const parsedResponse = parseJSONObjectFromText(response)

    if (parsedResponse) {
      responseData = parsedResponse
      console.log('got response', responseData)
      break
    }

    if (runtime.debugMode) {
      console.log(`UPDATE_PROFILE response: ${response}`)
    }
  }

  if (responseData) {
    const { user, description } = responseData

    // find the user
    const response = await runtime.supabase
      .from('accounts')
      .select('*')
      .eq('name', user)
      .single()
    const { data: userRecord, error } = response
    if (error) {
      console.error('error getting user', error)
      return
    }

    const userA = state.agentId!
    const userB = userRecord.id as UUID

    // find the room_id in 'relationships' where user_a is the agent and user_b is the user, OR vice versa
    const relationshipRecord = await getRelationship({
      supabase: runtime.supabase,
      userA,
      userB
    })

    const descriptionMemory =
      await runtime.descriptionManager.addEmbeddingToMemory({
        user_ids: [state.agentId, userRecord.id],
        user_id: state.agentId!,
        content: description,
        room_id: relationshipRecord.room_id
      })

    await runtime.descriptionManager.createMemory(descriptionMemory)
  } else if (runtime.debugMode) {
    console.log('Could not parse response')
  }
}

export default {
  name: 'UPDATE_DETAILS',
  description:
    'Update the details of the user using information collected from the conversation.',
  condition:
    'The user has mentioned where they live, how old they are and what gender they are.',
  handler,
  examples: []
} as Evaluator
