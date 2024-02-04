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
}:
{
  supabase: any;
  userIds: string[];
  userId?: string | null;
  onlyInProgress?: boolean;
  count?: number;
}) => {
  const { data: goals, error } = await supabase.rpc("get_goals_by_user_ids", {
    query_user_ids: userIds,
    query_user_id: userId,
    only_in_progress: onlyInProgress,
    row_count: count,
  });

  if (error) {
    throw new Error(error.message);
  }

  return goals;
};

/**
 * format the goals as a string
 */
export const formatGoalsAsString = async ({ goals }: { goals: any}) => {
  // format goals as a string
  const goalStrings = goals.map((goal: { name: any; status: any; objectives: any[]; }) => {
    const header = `${goal.name} - ${goal.status}`;
    const objectives = goal.objectives.map((step: { completed: any; description: any; }) => {
      return `- ${step.completed ? "[x]" : "[ ]"} ${step.description}`;
    });
    return `${header}\n${objectives.join("\n")}`;
  });
  return goalStrings.join("\n");
};

/**
 * Update goals by uuid in the goals table that contain the userIds
 * return null
 */
export const updateGoals = async ({ supabase, userIds, goals }: any) => {
  for (const goal of goals) {
    await supabase
      .from("goals")
      .update(goal)
      .match({ id: goal.id })
      .in("user_ids", userIds);
  }
};

/** Create a new goal in the `goals` table
 * return goal UUID
 * goal structure is { id (uuid), userIds (uuid[]), priority (boolean), required (boolean), name (string), plan (string), objectives: [ {description (string), status (DONE, FAILED, IN_PROGRESS) } ] }
 */
export const createGoal = async ({ supabase, goal, userIds, userId }: {
  supabase: any;
  goal: any;
  userIds: string[];
  userId: string;
}) => {
  const { error } = await supabase
    .from("goals")
    .upsert(
      { ...goal, user_ids: userIds, user_id: userId },
      { returning: "minimal" },
    );

  if (error) {
    throw new Error(error.message);
  }
};

/** Delete a goal by uuid in the goals table
 * return null
 */
export const cancelGoal = async ({ supabase, goalId }: any) => {
  await supabase
    .from("goals")
    .update({ status: "FAILED" })
    .match({ id: goalId });
};

/** Complete a goal by uuid in the goals table
 * return null
 */
export const finishGoal = async ({ supabase, goalId }: any) => {
  await supabase.from("goals").update({ status: "DONE" }).match({ id: goalId });
};

/** Complete a step in a goal */
export const finishGoalStep = async ({ supabase, goalId, stepId }: any) => {
  const { data: goal, error } = await supabase
    .from("goals")
    .select("*")
    .match({ id: goalId })
    .single();

  if (error) {
    throw new Error(error.message);
  }

  const updatedObjectives = goal.objectives.map((step: { id: any; }) => {
    if (step.id === stepId) {
      return { ...step, status: "DONE" };
    }
    return step;
  });

  await supabase
    .from("goals")
    .update({ objectives: updatedObjectives })
    .match({ id: goalId });
};
