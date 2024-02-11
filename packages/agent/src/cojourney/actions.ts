import { type Action } from '../lib/types'
import { type CojourneyRuntime } from '../lib/runtime'
import introduce from './actions/introduce'
/**
 * A list of tools/actions available to the agent
 */
export const customActions: Action[] = [
  introduce
]

export function addCustomActions (runtime: CojourneyRuntime) {
  customActions.forEach((action: Action) => {
    if (!runtime.getActions().includes(action)) {
      runtime.registerAction(action)
    }
  })
}
