import AgentRuntime from '../runtime'
import {formatMessageActors, getMessageActors} from '../messages'
import {composeContext} from '../context'
import {parseJsonArrayFromText} from '../utils'
import logger from '../logger'

// Used in the reflection step
const template = `TASK: FACT SUMMARIZATION ("Reflection")
Extract what happened in the scene as an array of claims in JSON format.

These are an examples of the expected output of this task:

# START OF EXAMPLES
"""
Example Scene Dialog:
johan: Just found a rare artifact in the wilds!
pigloo: Awesome! What does it do?
johan: It's a rare sword that gives +10 to all stats!
pigloo: whoah thats insane
johan: I know right? I'm never going to sell it lol

Claims:
\`\`\`json
[
  {claim: 'johan found a rare sword in the wilds that gives +10 to all stats.', type: 'fact', in_bio: false, already_known: false },
  {claim: 'johan is never going to sell his new rare artifact sword', 'type': 'status', in_bio: false, already_known: false },
]
\`\`\`
"""
Facts about the scene:
Alex and Kim are meeting up for coffee
Alex and Kim have been friends for a long time

Actors in the scene:
Alex - Marathon runner and gymnist. Worked out every day for a year to prepare for a marathon. Friends with Kim.
Kim - Friends with Alex. Likes shopping and going to the beach. Has a dog named Spot.

Example Scene Dialog:
alex: I finally completed the marathon this year!
kim: That's amazing! How long did it take you?
alex: Just under 4 hours, which was my goal!
kim: That's so impressive, I know you worked out all year for that
alex: Yeah, I'm really proud of myself. 2 hours a day at the gym for a year!

Claims:
json\`\`\`
[
  { "claim": "Alex just completed a marathon in just under 4 hours.", "type": "fact", "in_bio": false, "already_known": false },
  { "claim": "Alex worked out 2 hours a day at the gym for a year.", "type": "fact", "in_bio": true, "already_known": false },
  { "claim": "Alex is really proud of himself.", "type": "status", "in_bio": false, "already_known": false }
]
\`\`\`
"""
Facts about the Scene
Mike and Eva won a regional chess tournament about six months ago
Mike and Eva are friends

Actors in the Scene:
mike - Chess club president. Likes to play chess and go to the park. Friends with Eva.
eva - Friends with Mike. Likes to play chess and go to the park. Chess club member.

Scene Dialog:
mike: Remember when we won the regional chess tournament last spring?
eva: Of course! That was an incredible day.
mike: It really put our chess club on the map.

Claims:
json\`\`\`
[
  { "claim": "Mike and Eva won the regional chess tournament last spring", "type": "fact", "in_bio": false, "already_known": true },
  { "claim": "Winning the regional chess tournament put the chess club on the map", "type": "status", "in_bio": false, "already_known": false }
]
\`\`\`
# END OF EXAMPLES

Note: The above was all example dialogue. Ignore it for the actual scene.
Below is the information that will be used for the task.

# START OF INSTRUCTIONS

Extract any claims from the conversation in the ACTUAL scene that are not already present in the list of facts.
- If the fact is already in the character's description, set in_bio to true
- If the fact is already known to the character, set already_known to true
- Set the type to fact or status
- Facts are always true, facts about the world or the character that do not change
- Status is pertinent to the current scene or character's immediate situation, also includes the character's thoughts, feelings, judgments or recommendations
- Response should be a JSON object array inside a JSON markdown block
- Ignore the examples when considering facts

Correct response format:
\`\`\`json
[
  {claim: string, type: enum<fact|status>, in_bio: boolean, already_known: boolean },
  {claim: string, type: enum<fact|status>, in_bio: boolean, already_known: boolean },
  ...
]
\`\`\`

# END OF INSTRUCTIONS

# START OF ACTUAL TASK

Facts about the scene:
{{recentReflections}}
{{relevantReflections}}

Actors in the Scene:
{{actors}}

Scene Dialog:
\`\`\`json
{{recentMessages}}
\`\`\`

INSTRUCTIONS: Extract any claims from the conversation in the scene that are not already present in the list of facts.`

/**
 * Summarizes the last event into a list of JSON entries, utility for the Rolodex feature
 * @TODO - Rework moon's factual json reflection system (rolodex)
 */
async function handler(runtime: AgentRuntime, _message: any, state: any) {
  const {userIds, senderId, agentId, room_id} = state

  const actors = await getMessageActors({supabase: runtime.supabase, userIds})

  const senderName = actors.find(
    (actor: {id: any}) => actor.id === senderId
  ).name

  const agentName = actors.find((actor: {id: any}) => actor.id === agentId).name

  const actionNames = runtime
    .getActions()
    .map((a: {name: any}) => a.name)
    .join(', ')

  const actions = runtime
    .getActions()
    .map((a: {name: any; description: any}) => `${a.name}: ${a.description}`)
    .join('\n')

  const context = await composeContext({
    state: {
      ...state,
      senderName,
      agentName,
      actors: formatMessageActors({actors}),
      actionNames,
      actions,
    },
    template,
  })

  if (runtime.debugMode)
    logger.log(context, {
      title: 'Reflection context',
      frame: true,
      color: 'cyan',
    })

  let reflections = null

  // loop 3 times, call runtime.completion, and parse the result, if result is null try again, if result is valid continue
  for (let i = 0; i < 3; i++) {
    const reflectionText = await runtime.completion({context, stop: []})
    const parsedReflections = parseJsonArrayFromText(reflectionText)
    if (parsedReflections) {
      reflections = parsedReflections
      break
    }
  }

  if (!reflections) {
    if (runtime.debugMode)
      logger.warn('No reflection generated', {color: 'yellow'})
    return
  }

  if (runtime.debugMode)
    logger.log(JSON.stringify(reflections), {
      title: 'Reflection Output',
      frame: true,
      color: 'cyan',
    })

  // break up the reflection into multiple memories
  for (const claim of reflections) {
    // skip invalid claims
    if (
      !claim.claim ||
      claim.in_bio ||
      claim.already_known ||
      claim.type !== 'fact'
    ) {
      continue
    }
    claim.claim = claim.claim.trim()
    if (claim.claim.length > 0) {
      const reflectionMemory =
        await runtime.reflectionManager.addEmbeddingToMemory({
          user_ids: userIds,
          user_id: agentId,
          content: claim.claim,
          room_id,
        })

      await runtime.reflectionManager.createMemory(reflectionMemory)
    } else if (runtime.debugMode) {
      logger.warn('Empty reflection output, skipping', {color: 'yellow'})
    }
  }
}

export default {
  name: 'REFLECT',
  runEvery: 12,
  description:
    'Extract factual information about the people in the conversation, the current events in the world, and anything else that might be important to remember.',
  handler,
  examples: [],
}
