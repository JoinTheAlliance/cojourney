// State can be passed around to different parts of the agent to provide context for decision making
// State is also passed converted into a context object via template injection to generate a response with the LLM

import {UUID} from 'crypto'
import {getGoals, formatGoalsAsString} from './goals'
import {Action, Actor, Memory, Message} from './types'
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
  message: Message
) {
  const {
    senderId,
    agentId,
    userIds,
    room_id,
  } = message

  const {supabase} = runtime
  const recentMessageCount = runtime.getRecentMessageCount()
  const recentReflectionsCount = runtime.getRecentMessageCount() / 2
  const relevantReflectionsCount = runtime.getRecentMessageCount() / 2

  const [actorsData, recentMessagesData, recentReflectionsData, goalsData] =
    await Promise.all([
      getMessageActors({supabase, userIds: userIds as UUID[]}),
      runtime.messageManager.getMemoriesByIds({
        userIds: userIds as UUID[],
        count: recentMessageCount,
      }),
      runtime.reflectionManager.getMemoriesByIds({
        userIds: userIds as UUID[],
        count: recentReflectionsCount,
      }),
      getGoals({supabase, count: 10, onlyInProgress: true, userIds: userIds as UUID[]}),
    ])

  const goals = await formatGoalsAsString({goals: goalsData})

  let relevantReflectionsData = []

  if (recentReflectionsData.length > recentReflectionsCount - 1) {
    relevantReflectionsData =
      await runtime.reflectionManager.searchMemoriesByEmbedding(
        recentReflectionsData[0].embedding,
        {
          userIds: userIds as UUID[],
          count: relevantReflectionsCount,
        }
      )
    // filter out any entries in relevantReflectionsData that are also in recentReflectionsData
    relevantReflectionsData = relevantReflectionsData.filter(
      (reflection: Memory) => {
        return !recentReflectionsData.find(
          (recentReflection: Memory) => recentReflection.id === reflection.id
        )
      }
    )
  }

  const actors = formatMessageActors({actors: actorsData ?? []})

  const recentMessages = formatMessages({
    actors: (actorsData ?? []) as Actor[],
    messages: recentMessagesData.map((memory: Memory) => {
      const newMemory = {...memory}
      delete newMemory.embedding
      return newMemory
    }),
  })

  const recentReflections = formatReflections(recentReflectionsData)
  const relevantReflections = formatReflections(relevantReflectionsData)

  const senderName = actorsData?.find(
    (actor: Actor) => actor.id === senderId
  )?.name
  const agentName = actorsData?.find(
    (actor: Actor) => actor.id === agentId
  )?.name

  return {
    userIds,
    agentId,
    agentName,
    senderName,
    actors,
    actorsData,
    room_id,
    goals,
    goalsData,
    recentMessages,
    recentMessagesData,
    recentReflections,
    recentReflectionsData,
    relevantReflections,
    relevantReflectionsData,
    actionNames: runtime
      .getActions()
      .map((a: Action) => a.name)
      .join(', '),
    actions: runtime
      .getActions()
      .map(
        (a: Action) => `${a.name}: ${a.description}\nExamples:\n ${a.examples}`
      )
      .join('\n'),
    messageExamples: getRandomMessageExamples(5),
  }
}
