import { type Evaluator } from '../lib/types'

import { type CojourneyRuntime } from '../lib/runtime'
import details from './evaluators/details'
import profile from './evaluators/profile'

export const customEvaluators: Evaluator[] = [
  details,
  profile
]

export function addCustomEvaluators (runtime: CojourneyRuntime) {
  // if runtime.evaluators does not include any customEvaluators, add them
  customEvaluators.forEach((evaluator: Evaluator) => {
    if (!runtime.evaluators.includes(evaluator)) {
      runtime.evaluators.push(evaluator)
    }
  })
}
