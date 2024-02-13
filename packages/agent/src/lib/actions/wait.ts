import type CojourneyRuntime from '../runtime'
import { type Action, type Message } from '../types'

export default {
  name: 'WAIT',
  validate: async (_runtime: CojourneyRuntime, _message: Message) => {
    return true
  },
  description:
    'Do nothing and wait for another person to reply to the last message, or to continue their thought',
  handler: async (_runtime: CojourneyRuntime, message: Message): Promise<boolean> => {
    console.log('Waiting after: ', message)
    return true
  },
  condition: 'The agent wants to wait for the user to respond',
  examples: [JSON.stringify({ user: 'CJ', content: '', action: 'WAIT' })]
} as Action

