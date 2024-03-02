export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      relationships: {
        Row: {
          user_id: string
          created_at: string | null
          id: number
          room_id: string | null
          status: string
          user_a: string | null
          user_b: string | null
        }
        Insert: {
          user_id: string
          created_at?: string | null
          id?: number
          room_id?: string | null
          status?: string
          user_a?: string | null
          user_b?: string | null
        }
        Update: {
          user_id?: string
          created_at?: string | null
          id?: number
          room_id?: string | null
          status?: string
          user_a?: string | null
          user_b?: string | null
        }
      }
      messages: {
        Row: {
          created_at: string | null
          id: number
          content: {
            name?: string
            content: string
          }
          room_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          content: {
            name?: string
            content: string
          }
          room_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          content?: {
            name?: string
            content: string
          }
          room_id?: string
          updated_at?: string | null
          user_id?: string
        }
      }
      participants: {
        Row: {
          created_at: string | null
          id: number
          last_message_read: number | null
          room_id: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          last_message_read?: number | null
          room_id: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: number
          last_message_read?: number | null
          room_id?: string
          user_id?: string
        }
      }
      rooms: {
        Row: {
          created_at: string | null
          created_by: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string | null
          created_by?: string | null
          id?: string
          name?: string
        }
      }
      accounts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          avatar_url: string | null
          name: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          avatar_url?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          avatar_url?: string | null
          name?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_message_count: {
        Args: {
          p_user_id: string
        }
        Returns: Array<{
          room_id: string
          message_count: number
        }>
      }
      is_user_participant_in_room: {
        Args: {
          p_user_id: string
          p_room_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
