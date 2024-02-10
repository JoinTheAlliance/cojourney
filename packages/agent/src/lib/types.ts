import {UUID} from 'crypto'
import AgentRuntime from './runtime'

export type Relationship = {
    id: UUID
    user_a: UUID
    user_b: UUID
    user_id: UUID
    room_id: UUID
    status: string
    created_at?: string
}

export type Content = {
    content: string
    action: string
  }

export type Actor = {
    name: string
    description: string
    id: UUID
  }

export type Memory = {
  id?: UUID
  user_id: UUID
  created_at?: string
  content: Content | string
  embedding?: number[]
  user_ids: UUID[]
  room_id: UUID
}

export type Objective = {
    id: string
    description: string
    completed: boolean
}

export type Goal = {
    id: UUID
    user_ids: UUID[]
    user_id: UUID
    name: string
    status: string
    objectives: Objective[]
}

export type State = {
    userIds: UUID[]
    senderId?: UUID
    agentId?: UUID
    room_id: UUID
    agentName?: string
    senderName?: string
    actors?: string
    actorsData?: Actor[]
    goals?: string
    goalsData: Goal[]
    recentMessages?: string
    recentMessagesData?: Memory[]
    recentReflections?: string
    recentReflectionsData?: Memory[]
    relevantReflections?: string
    relevantReflectionsData?: Memory[]
    actionNames?: string
    actions?: string
    messageExamples?: string
    responseData?: any
}

// what onMessage etc receive
export type Message = {
    agentId?: UUID
    senderId?: UUID
    userIds?: UUID[]
    content: Content | string
    room_id: UUID
}

export type MessageExample = {
  user: string
  content: string | null
  action: string | null
}

export type Handler =  (runtime: AgentRuntime, message: Message, state: State) => Promise<any>

export type Action = {
    name: string
    description: string
    condition: string
    examples: string[]
    handler?: Handler
}

export type Evaluator = Action