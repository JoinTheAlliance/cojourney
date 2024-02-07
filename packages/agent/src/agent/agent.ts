import chalk from 'chalk'
import {
  Memory,
  composeContext,
  createInitialState,
  embeddingZeroVector,
  formatMessageActors,
  formatMessages,
  formatReflections,
  getMessageActors,
  getRandomMessageExamples,
} from '../lib'
import {defaultActions} from '../lib/actions'
import {formatGoalsAsString, getGoals} from '../lib/goals'
// import introduce from './actions/introduce'
import profile from './actions/profile'
// import objective from './actions/objective'
// import goal
//  from './actions/goal'
import {
  reflection_template,
  response_generation_template,
  update_generation_template,
} from './templates'
import {parseJSONObjectFromText, parseJsonArrayFromText} from './utils'

const customActions = [
  // introduce,
  profile,
  // goal,
  // objective
]

export const constants = {
  avatarPlaceholder: (seed: string | number) => {
    return `https://api.dicebear.com/6.x/micah/svg?seed=${seed}`
  },
  supabaseUrl: 'https://pronvzrzfwsptkojvudd.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InByb252enJ6ZndzcHRrb2p2dWRkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY4NTYwNDcsImV4cCI6MjAyMjQzMjA0N30.I6_-XrqssUb2SWYg5DjsUqSodNS3_RPoET3-aPdqywM',
}

export const agentActions = [...defaultActions, ...customActions]

export const initialize = () => {
  let timeout: NodeJS.Timeout | null = null
  let updateInterval = 10000
  const updateHandlers: any[] = []

  function callTimeout() {
    clearTimeout(timeout as NodeJS.Timeout)
    timeout = setTimeout(async () => {
      clearTimeout(timeout as NodeJS.Timeout)
      await updateHandlers.forEach((handler) => handler())
      callTimeout()
    }, updateInterval)
  }

  const start = (interval: number) => {
    updateInterval = interval
    callTimeout()
  }

  const reset = () => {
    if (timeout) {
      // clear timeout
      callTimeout()
    }
  }

  const registerHandler = (handler: any) => {
    updateHandlers.push(handler)
  }

  return {
    start,
    reset,
    registerHandler,
  }
}

// handle all messages - main entry point for the agent
// eventType is response or update
// userIds are UUIDs of users, stored in DB
// content is the user's message
// supabase is the supabase client
// messageManager and reflectionManager are all MemoryManagers which handle the database interactions
export const onMessage = async (message: any, runtime: any) => {
  const {content: senderContent} = message
  const {senderId, agentId, eventType, userIds, room_id} = message

  if (eventType === 'message' && !senderContent) {
    console.warn('Sender content null, skipping')
    return
  }

  if (
    eventType === 'update' &&
    runtime.getState().recentMessagesData?.length > 2
  ) {
    // read the last messages
    // if the last 3 messages are from the agent, or the last message from the agent has the WAIT action, then we should skip
    const currentMessages = runtime.getState().recentMessagesData ?? []
    const lastThreeMessages = currentMessages.slice(-3)
    const lastThreeMessagesFromAgent = lastThreeMessages.filter(
      (message: any) => message.user_id === agentId
    )
    if (lastThreeMessagesFromAgent.length === 3) {
      return console.log('Skipping because last three messages from agent')
    }
    // if the last two messages had the WAIT action from current agent, then we should skip
    const lastTwoMessagesFromAgent = lastThreeMessagesFromAgent.slice(-2)
    const lastTwoMessagesFromAgentWithWaitAction =
      lastTwoMessagesFromAgent.filter(
        (message: any) => message.content.action === 'WAIT'
      )
    if (lastTwoMessagesFromAgentWithWaitAction.length === 2) {
      return console.log(
        'Skipping because last two messages from agent had WAIT action'
      )
    }
  }

  const senderAction = message.action || 'null'

  // if eventType is 'start' then we can skip all this and just update the state and return
  const {supabase} = runtime
  const recentMessageCount = runtime.getRecentMessageCount()
  const recentReflectionsCount = runtime.getRecentMessageCount() / 2
  const relevantReflectionsCount = runtime.getRecentMessageCount() / 2

  const initialStateOpts = {
    agentId,
    supabase,
    eventType,
    senderId,
    senderContent,
    senderAction,
    userIds,
    count: 1,
  }

  const hasState = Object.keys(runtime.getState()).length > 0

  // switch between connect, message update templates
  const template = {
    update: update_generation_template,
    message: response_generation_template,
  }[eventType as string]

  const state = hasState
    ? {...runtime.getState(), ...initialStateOpts}
    : await createInitialState(initialStateOpts)

  async function _main() {
    // compose the text context for message generation
    const context = composeContext({
      context: state,
      template,
    })

    if (runtime.debugMode) {
      console.log(
        chalk.cyan(
          '******************** response context ********************\n'
        )
      )
      console.log(chalk.cyan(context))
      console.log(
        chalk.cyan(
          '\n**********************************************************'
        )
      )
    }

    let responseData

    for (let triesLeft = 3; triesLeft > 0; triesLeft--) {
      // generate the response
      const response = await runtime.completion({
        context,
        stop: [],
      })

      // parse the response, which is a json object block
      const parsedResponse = parseJSONObjectFromText(response)

      // if responder content doesnt' start with senderName: then we have a problem
      if (!parsedResponse?.user?.includes(state.agentName)) {
        if (runtime.debugMode) {
          console.log(
            chalk.red(
              'parsed response was the wrong user:',
              parsedResponse.user
            )
          )
        }
        continue
      }

      responseData = parsedResponse
      break
    }

    // return response result to the user
    if (!responseData) {
      throw new Error('No response generated')
    }

    //
    if (runtime.debugMode) {
      console.log(chalk.yellow(`responseData: ${JSON.stringify(responseData)}`))
    }

    runtime.sendMessage({
      ...message,
      content: responseData.content,
      action: responseData.action,
    })

    return responseData
  }

  /**
   * Handles the subsequent action execution if the main prompt outputs an action other than WAIT/CONTINUE
   * @TODO - implement process actions
   */
  async function _processActions(data: {action: any}) {
    if (!data.action) {
      return
    }

    const action = runtime
      .getActions()
      .find((a: {name: any}) => a.name === data.action)

    if (!action) {
      return // console.warn('No action found for', data.action)
    }

    if (!action.handler) {
      if (runtime.debugMode) {
        console.log(
          chalk.yellow(`No handler found for action ${action.name}, skipping`)
        )
      }
      return
    }

    await action.handler(data, state, runtime)
  }

  /**
   * Summarizes the last event into a list of JSON entries, utility for the Rolodex feature
   * @TODO - Rework moon's factual json reflection system (rolodex)
   */
  async function _reflect(responseData: {content: any; action: any}) {
    const totalMessages = await runtime.messageManager.countMemoriesByUserIds({
      userIds,
    })

    const modulo = Math.round(runtime.getRecentMessageCount() - 2)

    // if the total number of messages is divisible by the modulo within epsilon, then we should reflect
    // TODO: this is a pretty bad algorithm. we should probably store the count at the last reflection and compare or something
    if (totalMessages % modulo !== 0) {
      return
    }

    const actors = await getMessageActors({supabase, userIds})

    const senderName = actors.find(
      (actor: {id: any}) => actor.id === senderId
    ).name
    const agentName = actors.find(
      (actor: {id: any}) => actor.id === agentId
    ).name

    const context = await composeContext({
      context: {
        ...state,
        senderName,
        senderContent,
        senderAction,
        agentName,
        responderContent: responseData.content,
        responderAction: responseData.action,
        actors: formatMessageActors({actors}),
        actionNames: runtime
          .getActions()
          .map((a: {name: any}) => a.name)
          .join(', '),
        actions: runtime
          .getActions()
          .map(
            (a: {name: any; description: any}) => `${a.name}: ${a.description}`
          )
          .join('\n'),
      },
      template: reflection_template,
    })

    if (runtime.debugMode) {
      console.log(
        chalk.blue(
          '******************** reflection context ********************\n'
        )
      )
      console.log(chalk.blue(context))
      console.log(
        chalk.blue(
          '\n************************************************************'
        )
      )
    }

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
      if (runtime.debugMode) {
        console.log(chalk.red('No reflection generated'))
      }
      return
    }

    if (runtime.debugMode) {
      console.log(
        chalk.blueBright(
          '******************** reflection output ********************\n'
        )
      )
      console.log(chalk.blueBright(JSON.stringify(reflections)))
    }

    // break up the reflection into multiple memories
    for (const claim of reflections) {
      if (
        !claim.claim ||
        claim.in_bio ||
        claim.already_known ||
        claim.type !== 'fact'
      ) {
        // skip invalid claims
        continue
      }
      if (runtime.debugMode) {
        console.log(chalk.magenta(claim.claim))
      }
      claim.claim = claim.claim.trim()
      if (claim.claim.length > 0) {
        const reflectionMemory = await runtime.reflectionManager.bakeMemory(
          new Memory({
            user_ids: userIds,
            user_id: agentId,
            content: claim.claim,
            room_id,
          })
        )

        await runtime.reflectionManager.upsertRawMemory(
          reflectionMemory.toJSON()
        )
      } else {
        console.warn('Empty reflection, skipping')
      }
    }
    if (runtime.debugMode) {
      console.log(
        chalk.blueBright(
          '\n***********************************************************'
        )
      )
    }
  }

  async function _storeMemories(responseData: any) {
    let _senderContent = senderContent?.trim()
    // first, store the sender memory if it exists
    if (eventType === 'message' && _senderContent) {
      const senderMemory = new Memory({
        user_ids: userIds,
        user_id: senderId,
        // TODO: handle messages on actions, for example in the user interface
        content: {content: _senderContent, action: senderAction},
        room_id,
      })
      senderMemory.embedding = embeddingZeroVector

      await runtime.messageManager.upsertRawMemory(senderMemory.toJSON())
    }

    responseData.content = responseData.content?.trim()
    if (responseData.content) {
      const responseMemory = new Memory({
        user_ids: userIds,
        user_id: agentId,
        content: responseData,
        room_id,
      })

      responseMemory.embedding = embeddingZeroVector

      await runtime.messageManager.upsertRawMemory(responseMemory.toJSON())
    } else {
      console.warn('Empty response, skipping')
    }
  }

  /**
   * The last step of post-event handling, i.e, preparation of context for the next event
   */
  async function _composeNextContext() {
    // Initiate all asynchronous operations in parallel
    const [actorsData, recentMessagesData, recentReflectionsData, goalsData] =
      await Promise.all([
        getMessageActors({supabase, userIds}),
        runtime.messageManager.getMemoriesByIds({
          userIds,
          count: recentMessageCount,
        }),
        runtime.reflectionManager.getMemoriesByIds({
          userIds,
          count: recentReflectionsCount,
        }),
        getGoals({supabase, count: 10, onlyInProgress: true, userIds}),
      ])

    const goals = await formatGoalsAsString({goals: goalsData})

    let relevantReflectionsData = []

    if (recentReflectionsData.length > recentReflectionsCount - 1) {
      relevantReflectionsData =
        await runtime.reflectionManager.searchMemoriesByEmbedding(
          recentReflectionsData[0].embedding,
          {
            userIds,
            count: relevantReflectionsCount,
          }
        )
      // filter out any entries in relevantReflectionsData that are also in recentReflectionsData
      relevantReflectionsData = relevantReflectionsData.filter(
        (reflection: {id: any}) => {
          return !recentReflectionsData.find(
            (recentReflection: {id: any}) =>
              recentReflection.id === reflection.id
          )
        }
      )
    }

    // Process fetched data
    const actors = formatMessageActors({actors: actorsData})

    const recentMessages = formatMessages({
      actors: actorsData,
      messages: recentMessagesData.map((memory: {toJSON: () => any}) => {
        const newMemory = memory.toJSON()
        delete newMemory.embedding
        return newMemory
      }),
    })

    const recentReflections = formatReflections(recentReflectionsData)
    const relevantReflections = formatReflections(relevantReflectionsData)

    const senderName = actorsData.find(
      (actor: {id: any}) => actor.id === senderId
    ).name
    const agentName = actorsData.find(
      (actor: {id: any}) => actor.id === agentId
    ).name

    return {
      userIds,
      agentId,
      agentName,
      senderName,
      actors,
      goals,
      recentMessages,
      recentMessagesData,
      recentReflections,
      recentReflectionsData,
      relevantReflections,
      actionNames: runtime
        .getActions()
        .map((a: {name: any}) => a.name)
        .join(', '),
      actions: runtime
        .getActions()
        .map(
          (a: {name: any; description: any; examples: any}) =>
            `${a.name}: ${a.description}\nExamples:\n ${a.examples}`
        )
        .join('\n'),
      messageExamples: getRandomMessageExamples({count: 5}),
    }
  }

  if (eventType !== 'start') {
    const data = await _main()
    await _processActions(data)
    await _reflect(data)
    await _storeMemories(data)
  }

  // write out the state for the next call
  runtime.writeState(await _composeNextContext())
}
