import AgentRuntime from "./runtime";

/**
   * A list of tools/actions available to the agent
  */
export const defaultActions = [
  {
    name: "NONE",
    description: "Respond to the user and take no action",
    examples: [
      JSON.stringify({ user: "CJ", content: "I know right lol", action: "NONE" }),
    ],
  },
  {
    name: "CONTINUE",
    description: "Continue the conversation with the user",
    examples: [
      JSON.stringify({ user: "CJ", content: "The comet passing over tonight is going to be a sight to behold. Are you excited about it?", action: "CONTINUE" }),
    ],
  },
  {
    name: "WAIT",
    description: "Do nothing and wait for another person to reply, or continue their message",
    examples: [
      JSON.stringify({ user: "CJ", content: "", action: "WAIT" }),
    ],
  },
  {
    name: "IGNORE",
    description: "Ignore the user and do not respond, use this if your role involves being sassy, or mad at user",
    examples: [
      JSON.stringify({ user: "CJ", content: "", action: "IGNORE" }),
    ],
  },
];

/**
 * @param {AgentRuntime} runtime
 */
export function getFormattedActions(runtime: AgentRuntime) {
  const actions = runtime.getActions() as any[];
  // format the actins into a string by type and description
  const formattedActions = actions.map((action) => {
    return `${action.name} - ${action.description}`;
  });
  // join into a single string
  return formattedActions.join("\n");
}
