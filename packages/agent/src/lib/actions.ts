import type CojourneyRuntime from './runtime'
import { type Action } from './types'

/**
 * A list of tools/actions available to the agent
 */
export const defaultActions: Action[] = [
  {
    name: 'CONTINUE',
    description: 'Continue the conversation with the user',
    condition:
      'The agent wants to continue speaking and say something else as a continuation of the last thought',
    examples: [
      JSON.stringify({
        user: 'CJ',
        content:
          'The comet passing over tonight is going to be a sight to behold. Are you excited about it?',
        action: 'CONTINUE'
      })
    ]
  },
  {
    name: 'WAIT',
    description:
      'Do nothing and wait for another person to reply, or continue their message',
    condition: 'The agent wants to wait for the user to respond',
    examples: [JSON.stringify({ user: 'CJ', content: '', action: 'WAIT' })]
  },
  {
    name: 'IGNORE',
    description:
      'Ignore the user and do not respond, use this if your role involves being sassy, or mad at user',
    condition: 'The agent wants to ignore the user',
    examples: [JSON.stringify({ user: 'CJ', content: '', action: 'IGNORE' })]
  }
]

/**
 * @param {CojourneyRuntime} runtime
 */
export function getFormattedActions (runtime: CojourneyRuntime) {
  const actions = runtime.getActions()
  // format the actins into a string by type and description
  const formattedActions = actions.map((action) => {
    return `${action.name} - ${action.description}`
  })
  // join into a single string
  return formattedActions.join('\n')
}
