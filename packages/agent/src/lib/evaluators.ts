import reflect from './evaluators/reflect'
import { type Evaluator } from './types'

// evaluate runs the evaluators
export const defaultEvaluators: Evaluator[] = [reflect]
