// Context is the current memory of the scene
// Our system creates the context asynchronously to maximize reaction time to the user's input
// We do the heavy lifting of generating the context in the background, and then cache it for later use
// Context is shared by all members of the scene and keyed by userIds

import {
  formatMessageActors,
  getMessageActors,
  getRandomMessageExamples,
} from "./messages";

/* we need to generate an initial state for the conversation if there isn't any
 * this is the first message that the agent will send in update or respond to
 */
export async function createInitialState({
  supabase,
  senderId,
  agentId,
  userIds,
  senderContent,
}: {
  supabase: any;
  senderId: string;
  agentId: string;
  userIds: string[];
  senderContent: string;
}) {
  const actorData = await getMessageActors({
    supabase,
    userIds,
  }) as any[];

  const senderName = actorData.find((actor) => actor.id === senderId).name;
  const agentName = actorData.find((actor) => actor.id === agentId).name;

  const actors = formatMessageActors({
    actors: actorData,
  });

  return {
    senderName,
    agentName,
    actors,
    senderContent,
    messageExamples: getRandomMessageExamples({ count: 5 }),
  };
}

/** compose prompt template from variables and a context template
 * replace {{variables}} in {{ }} syntax with values from variables using the key names
 */
export const composeContext = ({ context, template }: any) => {
  // replace all {{variables}} in contextTemplate with values from variables using the key names
  const out = template.replace(/{{\w+}}/g, (match: any) => {
    const key = match.replace(/{{|}}/g, "");
    return context[key] ?? "";
  });
  return out;
};
