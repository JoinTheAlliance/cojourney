import {SupabaseClient} from '@supabase/supabase-js'
import {Goal, Objective} from './types'
import {UUID} from 'crypto'

/**
 * Goals is a way for agents to keep track of goals and progress in those goals
 * `goals` is a table of JSON objects keyed to current users and agents
 * Any agent in the goal will get the goal and can update the objectives
 * Some goals are priority (and will be emphasized in context), some are not
 * Some goals are required, some are not (and can be canceled)
 * returns array of goals as JSON objects
 * goals structure is [{ id (uuid), userIds (uuid[]), priority (boolean), required (boolean), name (string), plan (string), objectives: [ {description (string), status (DONE, FAILED, IN_PROGRESS) } ] }]
 */
export const getGoals = async ({
  supabase,
  userIds,
  userId = null,
  onlyInProgress = true,
  count = 5,
}: {
  supabase: SupabaseClient
  userIds: string[]
  userId?: string | null
  onlyInProgress?: boolean
  count?: number
}) => {
  const {data: goals, error} = await supabase.rpc('get_goals_by_user_ids', {
    query_user_ids: userIds,
    query_user_id: userId,
    only_in_progress: onlyInProgress,
    row_count: count,
  })

  if (error) {
    throw new Error(error.message)
  }

  return goals
}

/**
 * format the goals as a string
 */
export const formatGoalsAsString = async ({goals}: {goals: Goal[]}) => {
  // format goals as a string
  const goalStrings = goals.map((goal: Goal) => {
    const header = `${goal.name} - ${goal.status}`
    const objectives = goal.objectives.map((objective: Objective) => {
      return `- ${objective.completed ? '[x]' : '[ ]'} ${objective.description}`
    })
    return `${header}\n${objectives.join('\n')}`
  })
  return goalStrings.join('\n')
}

/**
 * Update goals by uuid in the goals table that contain the userIds
 * return null
 */
export const updateGoals = async ({
  supabase,
  userIds,
  goals,
}: {
  supabase: SupabaseClient
  userIds: UUID[]
  goals: Goal[]
}) => {
  for (const goal of goals) {
    await supabase
      .from('goals')
      .update(goal)
      .match({id: goal.id})
      .in('user_ids', userIds)
  }
}

/** Create a new goal in the `goals` table
 * return goal UUID
 * goal structure is { id (uuid), userIds (uuid[]), priority (boolean), required (boolean), name (string), plan (string), objectives: [ {description (string), status (DONE, FAILED, IN_PROGRESS) } ] }
 */
export const createGoal = async ({
  supabase,
  goal,
  userIds,
  userId,
}: {
  supabase: SupabaseClient
  goal: Goal
  userIds: string[]
  userId: string
}) => {
  const {error} = await supabase
    .from('goals')
    .upsert({...goal, user_ids: userIds, user_id: userId})

  if (error) {
    throw new Error(error.message)
  }
}

/** Delete a goal by uuid in the goals table
 * return null
 */
export const cancelGoal = async ({
  supabase,
  goalId,
}: {
  supabase: SupabaseClient
  goalId: UUID
}) => {
  await supabase.from('goals').update({status: 'FAILED'}).match({id: goalId})
}

/** Complete a goal by uuid in the goals table
 * return null
 */
export const finishGoal = async ({
  supabase,
  goalId,
}: {
  supabase: SupabaseClient
  goalId: UUID
}) => {
  await supabase.from('goals').update({status: 'DONE'}).match({id: goalId})
}

/** Complete a objective in a goal */
export const finishGoalStep = async ({
  supabase,
  goalId,
  stepId,
}: {
  supabase: SupabaseClient
  goalId: UUID
  stepId: string
}) => {
  const {data: goal, error} = await supabase
    .from('goals')
    .select('*')
    .match({id: goalId})
    .single()

  if (error) {
    throw new Error(error.message)
  }

  const updatedObjectives = goal.objectives.map((objective: Objective) => {
    if (objective.id === stepId) {
      return {...objective, status: 'DONE'}
    }
    return objective
  })

  await supabase
    .from('goals')
    .update({objectives: updatedObjectives})
    .match({id: goalId})
}
