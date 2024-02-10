import { type CojourneyRuntime } from '../lib/runtime'

/**
 * A list of tools/actions available to the agent
 */
export const customActions = []

export function addCustomActions (runtime: CojourneyRuntime) {
  customActions.forEach((action) => {
    if (!runtime.getActions().includes(action)) {
      runtime.registerAction(action)
    }
  })
}
