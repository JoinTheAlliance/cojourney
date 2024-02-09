// State can be passed around to different parts of the agent to provide context for decision making
// State is also passed converted into a context object via template injection to generate a response with the LLM

import { UUID } from 'crypto'
import { getGoals, formatGoalsAsString } from './goals'
import { Memory } from './memory'
import {
  getMessageActors,
  formatMessageActors,
  formatMessages,
  formatReflections,
  getRandomMessageExamples,
} from './messages'
import AgentRuntime from './runtime'

export async function composeState(
  runtime: AgentRuntime,
  userIds: UUID[],
  senderId: string,
  agentId: string
) {
  const { supabase } = runtime
  const recentMessageCount = runtime.getRecentMessageCount()
  const recentReflectionsCount = runtime.getRecentMessageCount() / 2
  const relevantReflectionsCount = runtime.getRecentMessageCount() / 2

  const [actorsData, recentMessagesData, recentReflectionsData, goalsData] =
    await Promise.all([
      getMessageActors({ supabase, userIds }),
      runtime.messageManager.getMemoriesByIds({
        userIds,
        count: recentMessageCount,
      }),
      runtime.reflectionManager.getMemoriesByIds({
        userIds,
        count: recentReflectionsCount,
      }),
      getGoals({ supabase, count: 10, onlyInProgress: true, userIds }),
    ])

  const goals = await formatGoalsAsString({ goals: goalsData })

  let relevantReflectionsData = []

  if (recentReflectionsData.length > recentReflectionsCount - 1) {
    relevantReflectionsData =
      await runtime.reflectionManager.searchMemoriesByEmbedding(
        recentReflectionsData[0].embedding,
        {
          userIds,
          count: relevantReflectionsCount,
        }
      )
    // filter out any entries in relevantReflectionsData that are also in recentReflectionsData
    relevantReflectionsData = relevantReflectionsData.filter(
      (reflection: { id: any }) => {
        return !recentReflectionsData.find(
          (recentReflection: { id: any }) => recentReflection.id === reflection.id
        )
      }
    )
  }

  const actors = formatMessageActors({ actors: actorsData })

  const recentMessages = formatMessages({
    actors: actorsData,
    messages: recentMessagesData.map((memory: Memory) => {
      const newMemory = { ...memory }
      delete newMemory.embedding
      return newMemory
    }),
  })

  const recentReflections = formatReflections(recentReflectionsData)
  const relevantReflections = formatReflections(relevantReflectionsData)

  const senderName = actorsData.find(
    (actor: { id: any }) => actor.id === senderId
  ).name
  const agentName = actorsData.find(
    (actor: { id: any }) => actor.id === agentId
  ).name

  return {
    userIds,
    agentId,
    agentName,
    senderName,
    actors,
    goals,
    recentMessages,
    recentMessagesData,
    recentReflections,
    recentReflectionsData,
    relevantReflections,
    actionNames: runtime
      .getActions()
      .map((a: { name: any }) => a.name)
      .join(', '),
    actions: runtime
      .getActions()
      .map(
        (a: { name: any; description: any; examples: any }) =>
          `${a.name}: ${a.description}\nExamples:\n ${a.examples}`
      )
      .join('\n'),
    messageExamples: getRandomMessageExamples({ count: 5 }),
  }
}
