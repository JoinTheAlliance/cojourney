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

import { type UUID } from 'crypto'
import { composeState, getRelationship, type CojourneyRuntime } from '../../lib'
import { composeContext } from '../../lib/context'
import { type Memory, type Message, type State } from '../../lib/types'
import { parseJSONObjectFromText } from '../../lib/utils'

const template = `TASK: Write a detailed personal and psychological profile for {{senderName}}.

Previous profiles written about {{senderName}}:
{{profiles}}

INSTRUCTIONS: You are writing a detailed and extensive new profile for {{senderName}} based on their existing profile and ongoing conversations. You should write the new profile based on the old profiles as well as any new information that has been revealed in the conversation.

Recent conversation:
{{recentMessages}}

TASK: Rewrite {{senderName}}'s profile.

Instructions: Generate a detailed profile for {{senderName}} in the conversations and respond with a JSON object. Write from the perspective of a therapist taking personal notes on a client. The profile should be extremely detailed and specific, and include any relevant facts or details from the conversation that should be remembered.

The profile should be broken up into basics, values, personal, career, hobbies, goals, family, history. Each should be a paragraph, at least 3 sentences in length.
Tagline - A short, catchy tagline that describes {{senderName}} (DO NOT include any really personal info or what they are looking for in a partner. Just a catchy tagline that describes them.)
Basics - Basic details about the person. Name, age, location, etc.
Values - Things that {{senderName}} values or believes. Things that they think are important in a friend or partner.
Career - Things about {{senderName}}'s work or career that might be important for a friend or partner to know.
Personality - What kind of person is {{senderName}}? What are they like? What kinds of personalities would they get along with, and who would get alon with them?
Hobbies - What {{senderName}} does for fun?
Goals - What {{senderName}} wants in the future for their life, career, or relationships?

Only include the sections that are relevant and have enough information from the source text to extract.

Respond with a JSON object in a markdown JSON block, formatted like this:
\`\`\`json
{
  "tagline": string,
  "basics": string,
  "values": string,
  "career": string,
  "personal": string,
  "hobbies": string,
  "goals": string
}
\`\`\``

const handler = async (
  runtime: CojourneyRuntime,
  message: Message
) => {
  const state = (await composeState(runtime, message)) as State

  // read the description for the current user
  const { senderId, agentId } = state
  const descriptions = await runtime.descriptionManager.getMemoriesByIds({ userIds: [senderId, agentId] as UUID[], count: 5 })
  const profiles = descriptions.map((d: Memory) => ('"""\n' + (d.content as string) + '\n"""')).join('\n')
  state.profiles = profiles

  // join profiles with
  //
  const context = composeContext({
    state,
    template
  })

  let responseData: Record<string, unknown> = {}

  for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
    console.log('*** context\n', context)
    // generate the response
    const response = await runtime.completion({
      context,
      stop: []
    })

    // parse the response, which is a json object block
    const parsedResponse = parseJSONObjectFromText(response)

    if (parsedResponse) {
      responseData = parsedResponse
      break
    }

    if (runtime.debugMode) {
      console.log(`UPDATE_PROFILE response:\n${response}`)
    }
  }

  if (responseData) {
    // join the values of all of the fields in the responseData object into a single string
    const description = Object.values(responseData).join('\n')

    // find the user
    const response = await runtime.supabase
      .from('accounts')
      .select('*')
      .eq('name', state.senderName)
      .single()
    const { data: userRecord, error } = response
    if (error) {
      console.error('error getting user', error)
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

    await runtime.descriptionManager.createMemory(descriptionMemory, true)

      // get the user's account details
      // set their details to the new details
      return description
  } else if (runtime.debugMode) {
    console.log('Could not parse response')
  }
  return ''
}

export default {
  name: 'UPDATE_PROFILE',
  description:
    'Update the profile of the user based on the ongoing conversation.',
  condition:
    'The user has revealed new personal information in the conversation which is important to update in their profile.',
  handler,
  examples: [
    `{

    }`

  ]
}
