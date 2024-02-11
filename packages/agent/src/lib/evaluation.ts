import reflect from './evaluators/reflect'
import { type Evaluator } from './types'
// import goal from './evaluators/goal';
import { type UUID } from 'crypto'
import { type Message, type State } from '../lib/types'
import type CojourneyRuntime from './runtime'

// evaluate runs the evaluators
export const defaultEvaluators: Evaluator[] = [
  reflect
  // goal,
]

// evaluation
export const evaluate = async (
  runtime: CojourneyRuntime,
  message: Message,
  state: State
) => {
  const { userIds } = state
  const totalMessages = await runtime.messageManager.countMemoriesByUserIds(
    userIds as UUID[]
  )

  // TODO: does this evaluation interval make sense?
  const modulo = Math.round(runtime.getRecentMessageCount() - 2)

  if (totalMessages % modulo !== 0) return

  console.log('running evaluation')

  // TODO: evaluation template

  // Get name, description and condition from the message
  // if should_name returns true, then we will add to array
  // call all evaluation handlers who have the name in the array

  runtime.evaluators.forEach(async (evaluator: Evaluator) => {
    if (!evaluator.handler) {
      console.log('no handler')
      return
    }
    console.log('calling handle', evaluator.name)
    await evaluator.handler(runtime, message)
  })
}
