// Context is the current memory of the scene
// Our system creates the context asynchronously to maximize reaction time to the user's input
// We do the heavy lifting of generating the context in the background, and then cache it for later use
// Context is shared by all members of the scene and keyed by userIds

import { type State } from './types'

/** compose prompt template from variables and a context template
 * replace {{variables}} in {{ }} syntax with values from variables using the key names
 */
export const composeContext = ({
  state,
  template
}: {
  state: State
  template: string
}) => {
  // replace all {{variables}} in contextTemplate with values from variables using the key names
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const out = template.replace(/{{\w+}}/g, (match) => {
    const key = match.replace(/{{|}}/g, '')
    return state[key] ?? ''
  })
  return out
}
