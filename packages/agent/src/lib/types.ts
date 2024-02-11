import { type UUID } from 'crypto'
import type CojourneyRuntime from './runtime'

export interface Relationship {
  id: UUID
  user_a: UUID
  user_b: UUID
  user_id: UUID
  room_id: UUID
  status: string
  created_at?: string
}

export interface Content {
  content: string
  action?: string
}

export interface Actor {
  name: string
  description: string
  id: UUID
}

export interface Memory {
  id?: UUID
  user_id: UUID
  created_at?: string
  content: Content | string
  embedding?: number[]
  user_ids: UUID[]
  room_id: UUID
}

export interface Objective {
  id: string
  description: string
  completed: boolean
}

export interface Goal {
  id: UUID
  user_ids: UUID[]
  user_id: UUID
  name: string
  status: string
  objectives: Objective[]
}

export interface State {
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
  responseData?: Content
  [key: string]: unknown
}

// what onMessage etc receive
export interface Message {
  agentId: UUID
  senderId: UUID
  userIds: UUID[]
  content: Content | string
  room_id: UUID
}

export interface MessageExample {
  user: string
  content: string | null
  action: string | null
}

export type Handler = (
  runtime: CojourneyRuntime,
  message: Message,
) => Promise<unknown>

export interface Action {
  name: string
  description: string
  condition: string
  examples: string[]
  handler: Handler | undefined
}

export interface Evaluator {
  name: string
  description: string
  condition: string
  examples: string[]
  handler: Handler | undefined
}
