import { Message, State } from '@/lib/types';
import { AgentRuntime } from '../lib/runtime';
import goal from './evaluators/goal';
import introduce from './evaluators/introduce';
import objective from './evaluators/objective';
import profile from './evaluators/profile';

export const customEvaluators = [
  goal,
  introduce,
  objective,
  profile
];

export function addCustomEvaluators(runtime: AgentRuntime) {
  // if runtime.evaluationHandlers does not include any customEvaluators, add them
  customEvaluators.forEach((evaluation) => {
    if (!runtime.evaluationHandlers.includes(evaluation)) {
      runtime.evaluationHandlers.push(evaluation)
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
  
    runtime.evaluationHandlers.forEach(async (handler: Handler) => {
      await handler(runtime, message, state);
    });
}