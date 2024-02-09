import { Memory } from "./memory";
import { messageExamples } from "./messageExamples";

/** Get the actors who are participating in the message, for context injection of name and description
 * agents is the array of default agents to search from
 * userIds are UUIDs of users, stored in DB
 */
export async function getMessageActors({ supabase, userIds }: any) {
  const response = await supabase
    .from("accounts")
    .select("*")
    .in("id", userIds);

  if (response.error) {
    console.error(response.error);
    return null;
  }

  const { data } = response;

  // join the data from the database with the data from the exampleNpcs
  const characters = data.map((character: any) => {
    const { name, description, id } = character;
    return {
      name,
      description,
      id
    };
  });

  return characters;
}

export function formatMessageActors({ actors }: any) {
  // format actors as a string
  const actorStrings = actors.map((actor: { name: any; description: any; }) => {
    const header = `${actor.name}: ${actor.description ?? "No description"}`;
    return header;
  });
  const finalActorStrings = actorStrings.join("\n");
  return finalActorStrings;
}

/** get random conversation examples
 * return an array of random conversation examples from the messageExamples array
 */
export const getRandomMessageExamples = ({ count }: any) => {
  // return an array of random conversation examples from the messageExamples array
  const examples: ({ user: string; content: string; action: null; } | { user: string; content: string; action: string; })[][] = [];
  // make sure the examples are not duplicated
  while (examples.length < count && examples.length < messageExamples.length) {
    const randomIndex = Math.floor(Math.random() * messageExamples.length);
    const randomExample = messageExamples[randomIndex];
    if (!examples.includes(randomExample)) {
      examples.push(randomExample);
    }
  }

  // exampe messages is an array of arrays of objects
  // format the examples so that each object is on one line
  const formattedExamples = examples.map((example) => {
    return (
      `\n\n${
      example
        .map((message) => {
          return JSON.stringify(message);
        })
        .join("\n")}`
    );
  });

  return formattedExamples;

  // return JSON.stringify(examples, null, 2);
};

// format conversation as string
export const formatMessages = ({ messages, actors }: any) => {
  // format conversation as a string
  const messageStrings = messages
    .reverse()
    .filter((message: { user_id: any; }) => message.user_id)
    .map((message: { user_id: any; content: { content: any; action: any; }; }) => {
      const sender = actors.find((actor: { id: any; }) => actor.id === message.user_id);
      const senderName = sender.name ?? sender.content?.user;
      return `{ "user": "${senderName}", "content": "${message.content.content}", "action": "${message.content.action}" }`;
    })
    .join("\n");
  return messageStrings;
};

/** format conversation as string */
export const formatReflections = (reflections: any[]) => {
  // format conversation as a string
  const messageStrings = reflections.reverse().map((reflection: Memory) =>
    `${reflection.content}`
  );
  const finalMessageStrings = messageStrings.join("\n");
  return finalMessageStrings;
};
