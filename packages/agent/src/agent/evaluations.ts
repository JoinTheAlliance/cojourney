import { AgentRuntime } from '../lib/runtime';
import goal from './evaluations/goal';
import introduce from './evaluations/introduce';
import objective from './evaluations/objective';
import profile from './evaluations/profile';

export const customEvaluators = [
  goal,
  introduce,
  objective,
  profile
];

// evaluation
export const evaluate = async (runtime: AgentRuntime, message: any, state: any) => {
  const {userIds} = state
  const totalMessages =
    await runtime.messageManager.countMemoriesByUserIds(userIds)

  // TODO: does this evaluation interval make sense?
  const modulo = Math.round(runtime.getRecentMessageCount() - 2)

  if (totalMessages % modulo !== 0) return

  runtime.evaluate(message, state)
}