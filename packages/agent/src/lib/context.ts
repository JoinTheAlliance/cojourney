// Context is the current memory of the scene
// Our system creates the context asynchronously to maximize reaction time to the user's input
// We do the heavy lifting of generating the context in the background, and then cache it for later use
// Context is shared by all members of the scene and keyed by userIds

import { State } from "./types";

/** compose prompt template from variables and a context template
 * replace {{variables}} in {{ }} syntax with values from variables using the key names
 */
export const composeContext = ({ state, template }: { state: State, template: string}) => {
  // replace all {{variables}} in contextTemplate with values from variables using the key names
  const out = template.replace(/{{\w+}}/g, (match: string) => {
    const key = match.replace(/{{|}}/g, "");
    return (state as any)[key] ?? "";
  });
  return out;
};