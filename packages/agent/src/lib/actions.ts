import ignore from './actions/ignore'
import wait from './actions/wait'
import type CojourneyRuntime from './runtime'
import { type Action } from './types'
import continue_ from './actions/continue'

/**
 * A list of tools/actions available to the agent
 */
export const defaultActions: Action[] = [
  continue_,
  wait,
  ignore
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
