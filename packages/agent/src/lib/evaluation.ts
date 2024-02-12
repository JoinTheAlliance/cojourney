import { type Message, type State } from '../lib/types'
import { composeContext } from './context'
import reflect from './evaluators/reflect'
import type CojourneyRuntime from './runtime'
import { type Evaluator } from './types'
import { parseJsonArrayFromText } from './utils'

// evaluate runs the evaluators
export const defaultEvaluators: Evaluator[] = [
  reflect
  // goal,
]

const template = `TASK: Based on the conversation and conditions, determine which evaluation functions are appropriate to call.
Examples:
{{evaluatorExamples}}

INSTRUCTIONS: You are helping me to decide which appropriate functions to call based on the conversation between {{senderName}} and {{agentName}}.

Recent conversation:
{{recentMessages}}

Evaluator Functions:
{{evaluators}}

Evaluator Conditions:
{{evaluatorConditions}}

TASK: Based on the most recent conversation, determine which evaluators functions are appropriate to call to call.
Include the name of evaluators that are relevant and should be called in the array
Available evaluator names to include are {{evaluatorNames}}
Respond with a JSON array containing a field for description in a JSON block formatted for markdown with this structure:
\`\`\`json
[
  'evaluatorName',
  'evaluatorName'
]
\`\`\`

Your response must include the JSON block.`

// evaluation
export const evaluate = async (
  runtime: CojourneyRuntime,
  message: Message,
  state: State
) => {
  // 3. make sure all the evaluators have conditionals and desciptions
  // 4. write test and validate

  const evaluatorPromises = runtime.evaluators.map(async (evaluator: Evaluator) => {
    if (!evaluator.handler) {
      console.log('no handler')
      return
    }
    console.log('calling conditional', evaluator.name)
    const result = await evaluator.validate(runtime, message)
    if (result) {
      return evaluator
    }
    return null
  })

  const resolvedEvaluators = await Promise.all(evaluatorPromises)
  const evaluatorsData = resolvedEvaluators.filter(Boolean)

  // format the evaluators
  const evaluators = formatEvaluators(evaluatorsData as Evaluator[])
  const evaluatorNames = formatEvaluatorNames(evaluatorsData as Evaluator[])
  const evaluatorConditions = formatEvaluatorConditions(evaluatorsData as Evaluator[])

  const context = composeContext({ state: { ...state, evaluators, evaluatorNames, evaluatorConditions }, template })

  const result = await runtime.completion({
    context
  })

  console.log('evaluation result is', result)

  // parse the result array
  const parsedResult = parseJsonArrayFromText(result)

  console.log('parsedResult', parsedResult)

  runtime.evaluators
    .filter((evaluator: Evaluator) => evaluator.handler && parsedResult?.includes(evaluator.name))
    .forEach((evaluator: Evaluator) => {
      if (!evaluator?.handler) return

      evaluator.handler(runtime, message)
    })
}

export function formatEvaluatorNames (evaluators: Evaluator[]) {
  return evaluators.map((evaluator: Evaluator) => `'${evaluator.name}'`).join(',\n')
}

export function formatEvaluators (evaluators: Evaluator[]) {
  return evaluators.map((evaluator: Evaluator) => `'${evaluator.name}: ${evaluator.description}'`).join(',\n')
}

export function formatEvaluatorConditions (evaluators: Evaluator[]) {
  return evaluators.map((evaluator: Evaluator) => `'${evaluator.name}: ${evaluator.condition}'`).join(',\n')
}
