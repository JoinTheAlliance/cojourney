import ignore from './actions/ignore'
import wait from './actions/wait'
import type CojourneyRuntime from './runtime'
import { type Message, type Action } from './types'
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
export async function getActions (runtime: CojourneyRuntime, message: Message) {
  const actionPromises = runtime.getActions().map(async (action: Action) => {
    if (!action.handler) {
      console.log('no handler')
      return
    }

    const result = await action.validate(runtime, message)
    if (result) {
      return action
    }
    return null
  })

  const resolvedActions = await Promise.all(actionPromises)
  const actionsData = resolvedActions.filter(Boolean) as Action[]
  return actionsData
}

export function getFormattedActions (actions: Action[]) {
  const formattedActions = actions.map((action) => {
    return `${action.name} - ${action.description}`
  })
  // join into a single string
  return formattedActions.join('\n')
}

export function formatActionNames (actions: Action[]) {
  return actions.map((action: Action) => `'${action.name}'`).join(',\n')
}

export function formatActions (actions: Action[]) {
  return actions.map((action: Action) => `'${action.name}: ${action.description}'`).join(',\n')
}

export function formatActionConditions (actions: Action[]) {
  return actions.map((action: Action) => `'${action.name}: ${action.condition}'`).join(',\n')
}

export function formatActionExamples (actions: Action[]) {
  return actions.map((action: Action) => `'${action.name}\n${action.examples.map(
    (example) => example
  ).join('\n'
  )}'`).join(',\n')
}
