import chalk from 'chalk'
import {parseJSONObjectFromText} from '../utils'
import {composeContext} from '../../lib/context'
import { Memory } from '@/lib'

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

const handler = async (message: any, state: any, runtime: any) => {
  console.log('profile update message', message)

  console.log('state is', state)
  
  // 

  // TODO:
  // get the target from the message

  // then, search for the user in the actors

  // then inject their profile

  const context = composeContext({
    context: {
      ...state,
    },
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
      console.log(chalk.yellow(`UPDATE_PROFILE response: ${response}`))
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
    const response2 = await runtime.supabase.from("relationships").select("*")
      .or(`user_a.eq.${userA},user_b.eq.${userB},user_a.eq.${userB},user_b.eq.${userA}`)
      .single();
    const { data: relationshipRecord, error: error2 } = response2;
    if(error2) {
      console.error('error getting relationship', error2)
      return
    }

    console.log('relationshipRecord is', relationshipRecord)

    console.log('userRecord is', userRecord)

    const descriptionMemory = new Memory({
      user_ids: [state.agentId, userRecord.id],
      user_id: state.agentId,
      content: description,
      room_id: relationshipRecord.room_id,
    })
    console.log('descriptionMemory', descriptionMemory.toJSON())
    await runtime.descriptionManager.upsertRawMemory(descriptionMemory);
    console.log('stored descriptionMemory', descriptionMemory)
  } else if (runtime.debugMode) {
    console.log(chalk.red('Could not parse response'))
  }
}

export default {
  name: 'UPDATE_PROFILE',
  description:
    'Update the profile of the user based on the ongoing conversation.',
  handler,
  examples: [],
}
