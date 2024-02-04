import chalk from 'chalk'
import {parseJSONObjectFromText} from '../utils'
import {composeContext} from '../../lib/context'
import {createRelationship} from '../../lib/relationships'

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
  // TODO:
  // first, evaluate if the profile should be updated

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
      break
    }

    if (runtime.debugMode) {
      console.log(chalk.yellow(`UPDATE_PROFILE response: ${response}`))
    }
  }

  if (responseData && responseData.userA && responseData.userB) {
    await createRelationship({
      supabase: runtime.supabase,
      userA: responseData.userA,
      userB: responseData.userB,
    })
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
