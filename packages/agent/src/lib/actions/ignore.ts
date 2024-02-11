import type CojourneyRuntime from '../runtime'
import { type Message } from '../types'

export default {
  name: 'IGNORE',
  description:
    'Ignore the user and do not respond, use this if your role involves being sassy, or mad at user',
    handler: async (_runtime: CojourneyRuntime, message: Message) => {
      console.log('IGNORE', message)
  },
  condition: 'The agent wants to ignore the user',
  examples: [JSON.stringify({ user: 'CJ', content: '', action: 'IGNORE' })]
}
