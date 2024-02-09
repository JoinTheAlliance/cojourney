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
    

import {parseJSONObjectFromText} from '../../lib/utils'
import {composeContext} from '../../lib/context'
import { AgentRuntime, getRelationship } from '../../lib'
import { Message, State } from '@/lib/types'

const template = `You are writing a profile for {{senderName}} based on their existing profile and ongoing conversations.

{{senderName}}'s current profile:
{{profile}}

Recent conversation:
{{recentConversation}}

Using the most recent conversation, update {{senderName}}'s profile.
Include any information that you think is relevant to the user's profile.
The response should be a combination of the details from the current profile and the new information from the conversation.

Then respond with a JSON object containing a field for description in a JSON block formatted for markdown with this structure:
\`\`\`json
{ user: string, description: string }
\`\`\`

Your response must include the JSON block.`

const handler = async (_message: Message, state: State, runtime: AgentRuntime) => {
  // 

  // TODO:
  // get the target from the message

  // then, search for the user in the actors

  // then inject their profile

  const context = composeContext({
    state,
    template,
  })

  let responseData = null

  for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
    // generate the response
    const response = await runtime.completion({
      context,
      stop: [],
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
    const { user, description } = responseData;

    // find the user
    const response = await runtime.supabase.from('accounts').select('*').eq('name', user).single()
    const { data: userRecord, error } = response;
    if(error) {
      console.error('error getting user', error)
      return
    }

    const userA = state.agentId;
    const userB = userRecord.id;

    // find the room_id in 'relationships' where user_a is the agent and user_b is the user, OR vice versa
    const relationshipRecord = await getRelationship({ supabase: runtime.supabase, userA, userB });

    const descriptionMemory = await runtime.descriptionManager.addEmbeddingToMemory({
      user_ids: [state.agentId, userRecord.id],
      user_id: state.agentId,
      content: description,
      room_id: relationshipRecord.room_id,
    })

    await runtime.descriptionManager.createMemory(descriptionMemory);
  } else if (runtime.debugMode) {
    console.log('Could not parse response')
  }
}

export default {
  name: 'UPDATE_PROFILE',
  description:
    'Update the profile of the user based on the ongoing conversation.',
  handler,
  examples: [],
}
