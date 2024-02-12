// State can be passed around to different parts of the agent to provide context for decision making
// State is also passed converted into a context object via template injection to generate a response with the LLM

import { formatActionConditions, formatActionExamples, formatActionNames, formatActions, getActions } from './actions'
import { formatGoalsAsString, getGoals } from './goals'
import {
  formatMessageActors,
  formatMessages,
  formatReflections,
  getMessageActors,
  getRandomMessageExamples
} from './messages'
import type CojourneyRuntime from './runtime'
import {
  type Goal,
  type Action,
  type Actor,
  type Memory,
  type Message
} from './types'

export async function composeState (
  runtime: CojourneyRuntime,
  message: Message
) {
  const { senderId, agentId, userIds, room_id } = message

  const { supabase } = runtime
  const recentMessageCount = runtime.getRecentMessageCount()
  const recentReflectionsCount = runtime.getRecentMessageCount() / 2
  const relevantReflectionsCount = runtime.getRecentMessageCount() / 2

  const [actorsData, recentMessagesData, recentReflectionsData, goalsData, actionsData]: [
    Actor[],
    Memory[],
    Memory[],
    Goal[],
    Action[],
  ] = await Promise.all([
    getMessageActors({ supabase, userIds: userIds! }),
    runtime.messageManager.getMemoriesByIds({
      userIds: userIds!,
      count: recentMessageCount
    }),
    runtime.reflectionManager.getMemoriesByIds({
      userIds: userIds!,
      count: recentReflectionsCount
    }),
    getGoals({
      supabase,
      count: 10,
      onlyInProgress: true,
      userIds: userIds!
    }),
    getActions(runtime, message)
  ])

  const goals = await formatGoalsAsString({ goals: goalsData })

  let relevantReflectionsData: Memory[] = []

  if (recentReflectionsData.length > 0) {
  // only try to get relevant reflections if there are already enough recent reflections
  // if (recentReflectionsData.length > recentReflectionsCount - 1) {
    relevantReflectionsData =
      (await runtime.reflectionManager.searchMemoriesByEmbedding(
        recentReflectionsData[0].embedding!,
        {
          userIds: userIds!,
          count: relevantReflectionsCount
        }
      ))
    //   .filter(
    //   (reflection: Memory) => {
    //     return !recentReflectionsData.find(
    //       (recentReflection: Memory) => recentReflection.id === reflection.id
    //     )
    //   }
    // )
  // }
  }

  const actors = formatMessageActors({ actors: actorsData ?? [] })

  // console.log('recentReflectionsData', recentReflectionsData.map((memory: Memory) => {
  //  const newMemory = { ...memory }
  //  delete newMemory.embedding
  //  return newMemory
  // }))

  // console.log('relevantReflectionsData', relevantReflectionsData.map((memory: Memory) => {
  //   const newMemory = { ...memory }
  //   delete newMemory.embedding
  //   return newMemory
  //  }))

  const recentMessages = formatMessages({
    actors: actorsData ?? [],
    messages: recentMessagesData.map((memory: Memory) => {
      const newMemory = { ...memory }
      delete newMemory.embedding
      return newMemory
    })
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
    actionNames: formatActionNames(actionsData),
    actionConditions: formatActionConditions(actionsData),
    actionExamples: formatActionExamples(actionsData),
    actions: formatActions(actionsData),
    messageExamples: getRandomMessageExamples(5)
  }
}
