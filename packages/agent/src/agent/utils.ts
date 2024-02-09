import {
  AgentRuntime
} from '../lib'
import { customActions } from './actions'
import { customEvaluators } from './evaluations'

export function shouldSkipMessage(state: any, agentId: string): boolean {
  if (
    state.recentMessagesData?.length > 2
  ) {
    // read the last messages
    // if the last 3 messages are from the agent, or the last message from the agent has the WAIT action, then we should skip
    const currentMessages = state.recentMessagesData ?? []
    const lastThreeMessages = currentMessages.slice(-3)
    const lastThreeMessagesFromAgent = lastThreeMessages.filter(
      (message: any) => message.user_id === agentId
    )
    if (lastThreeMessagesFromAgent.length === 3) {
      return true
    }
    // if the last two messages had the WAIT action from current agent, then we should skip
    const lastTwoMessagesFromAgent = lastThreeMessagesFromAgent.slice(-2)
    const lastTwoMessagesFromAgentWithWaitAction =
      lastTwoMessagesFromAgent.filter(
        (message: any) => message.content.action === 'WAIT'
      )
    if (lastTwoMessagesFromAgentWithWaitAction.length === 2) {
      return true
    }
  }
  return false
}

export function addCustomActions(runtime: AgentRuntime) {
  customActions.forEach((action) => {
    if (!runtime.getActions().includes(action)) {
      runtime.registerActionHandler(action)
    }
  });

    // if runtime.evaluationHandlers does not include any customEvaluators, add them
  customEvaluators.forEach((evaluation) => {
  if (!runtime.evaluationHandlers.includes(evaluation)) {
    runtime.evaluationHandlers.push(evaluation)
  }
});
}

export function parseJsonArrayFromText(text: any) {
  let jsonData = null;

  // Check for json block
  const jsonBlockPattern = /```json\n([\s\S]*?)\n```/;
  const jsonBlockMatch = text.match(jsonBlockPattern);

  if (jsonBlockMatch) {
    // Extract and parse json block content
    try {
      jsonData = JSON.parse(jsonBlockMatch[1]);
    } catch (e) {
      // If parsing fails, return null
      return null;
    }
  } else {
    // Check for array-like structure without json block
    const arrayPattern = /\[\s*{[\s\S]*?}\s*\]/;
    const arrayMatch = text.match(arrayPattern);

    if (arrayMatch) {
      // Extract and parse array content
      try {
        jsonData = JSON.parse(arrayMatch[0]);
      } catch (e) {
        // If parsing fails, return null
        return null;
      }
    }
  }

  // Check if parsed data is an array and has the expected structure
  if (Array.isArray(jsonData) && jsonData.every(item => typeof item === 'object' && 'claim' in item && 'type' in item)) {
    return jsonData;
  } else {
    // If data is invalid or does not meet the expected structure, return null
    return null;
  }
}

export function parseJSONObjectFromText(text: any) {
  let jsonData = null;

  // Check for json block
  const jsonBlockPattern = /```json\n([\s\S]*?)\n```/;
  const jsonBlockMatch = text.match(jsonBlockPattern);

  if (jsonBlockMatch) {
    // Extract and parse json block content
    try {
      jsonData = JSON.parse(jsonBlockMatch[1]);
    } catch (e) {
      // If parsing fails, return null
      return null;
    }
  } else {
    // Check for object-like structure without json block
    const objectPattern = /{[\s\S]*?}/;
    const objectMatch = text.match(objectPattern);

    if (objectMatch) {
      // Extract and parse object content
      try {
        jsonData = JSON.parse(objectMatch[0]);
      } catch (e) {
        // If parsing fails, return null
        return null;
      }
    }
  }

  // Check if parsed data is an object (and not an array)
  if (typeof jsonData === 'object' && jsonData !== null && !Array.isArray(jsonData)) {
    return jsonData;
  } else if (typeof jsonData === 'object' && Array.isArray(jsonData)) {
    return parseJsonArrayFromText(text);
  } else {
    // If data is invalid or is not an object, return null
    return null;
  }
}
