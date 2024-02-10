import { Evaluator, Message, State } from '@/lib/types';
import { AgentRuntime } from '../lib/runtime';
// import goal from './evaluators/goal';
// import introduce from './evaluators/introduce';
// import objective from './evaluators/objective';
import profile from './evaluators/profile';

export const customEvaluators: Evaluator[] = [
  // goal,
  // introduce,
  // objective,
  profile
]

export function addCustomEvaluators(runtime: AgentRuntime) {
  // if runtime.evaluators does not include any customEvaluators, add them
  customEvaluators.forEach((evaluator) => {
    if (!runtime.evaluators.includes(evaluator)) {
      runtime.evaluators.push(evaluator)
    }
  });
}

// evaluation
export const evaluate = async (runtime: AgentRuntime, message: Message, state: State) => {
  const {userIds} = state
  const totalMessages =
    await runtime.messageManager.countMemoriesByUserIds(userIds)

  // TODO: does this evaluation interval make sense?
  const modulo = Math.round(runtime.getRecentMessageCount() - 2)

  if (totalMessages % modulo !== 0) return


  // TODO: evaluation template

  // Get name, description and condition from the message
  // if should_name returns true, then we will add to array
  // call all evaluation handlers who have the name in the array
  
    runtime.evaluators
    .forEach(async (evaluator) => {
      if(!evaluator.handler) return;
      await evaluator.handler(runtime, message, state);
    });
}