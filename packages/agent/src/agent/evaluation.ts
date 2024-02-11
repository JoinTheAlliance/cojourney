import { type UUID } from 'crypto'
import { type Evaluator, type Message, type State } from '../lib/types'

import { type CojourneyRuntime } from '../lib/runtime'
// import goal from './evaluators/goal';
// import introduce from './evaluators/introduce';
// import objective from './evaluators/objective';
import description from './evaluators/details'
import profile from './evaluators/profile'

export const customEvaluators: Evaluator[] = [
  // goal,
  // introduce,
  // objective,
  profile,
  description
]

export function addCustomEvaluators (runtime: CojourneyRuntime) {
  // if runtime.evaluators does not include any customEvaluators, add them
  customEvaluators.forEach((evaluator: Evaluator) => {
    if (!runtime.evaluators.includes(evaluator)) {
      runtime.evaluators.push(evaluator)
    }
  })
}

// evaluation
export const evaluate = async (
  runtime: CojourneyRuntime,
  message: Message,
  state: State
) => {
  const { userIds } = state
  const totalMessages =
    await runtime.messageManager.countMemoriesByUserIds(userIds as UUID[])

  // TODO: does this evaluation interval make sense?
  const modulo = Math.round(runtime.getRecentMessageCount() - 2)

  if (totalMessages % modulo !== 0) return

  console.log('running evaluation')

  // TODO: evaluation template

  // Get name, description and condition from the message
  // if should_name returns true, then we will add to array
  // call all evaluation handlers who have the name in the array

  runtime.evaluators.forEach(async (evaluator) => {
    if (!evaluator.handler) {
      console.log('no handler')
      return
    }
    console.log('calling handle', evaluator.name)
    await evaluator.handler(runtime, message)
  })
}
