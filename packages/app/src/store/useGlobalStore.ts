import { type RealtimePresenceState, type SupabaseClient } from "@supabase/supabase-js"
import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"
import { type Database } from "../../types/database.types"

export type IDatabaseRoom = Database["public"]["Tables"]["rooms"]["Row"]
type IDatabaseParticipantsWithoutUsers =
  Database["public"]["Tables"]["participants"]["Row"]
type IDatabaseMessagesWithoutUsers =
  Database["public"]["Tables"]["messages"]["Row"]
export type IDatabaseUser = Database["public"]["Tables"]["accounts"]["Row"]
type IDatabaseFriends = Database["public"]["Tables"]["relationships"]["Row"]

export interface IUser {
  email: string | null
  avatar_url: string | null
  name: string | null
  registerComplete: boolean | null
  uid: string | null
  location: string | null
  details: Record<string, unknown> | null
  signed_tos: boolean
}

interface IPreferences {
  theme: string
}

export interface IDatabaseParticipants
  extends IDatabaseParticipantsWithoutUsers {
  userData: IDatabaseUser | IDatabaseUser[] | null
}

export interface IDatabaseMessage extends IDatabaseMessagesWithoutUsers {
  userData: IDatabaseUser | IDatabaseUser[] | null
}

export interface IRoom extends IDatabaseRoom {
  participants: IDatabaseParticipants[]
  relationships: IFriend[]
}

interface IApp {
  isLoading: boolean
  isLoadingRooms: boolean
  isMobileMenuOpen: boolean
  isTldrMenuOpen: boolean
  mainActiveSideMenu: string | null
  messageAccordionSelected: string | null
  onlineUsers: RealtimePresenceState | null
  registerUserActiveStep: number
  secondaryActiveSideMenu: string | null
}

export interface IUsersTyping {
  email: string
  isTyping: boolean
  name: string
  uid: string
}

export interface IFriend extends IDatabaseFriends {
  actionUserData: IDatabaseUser | IDatabaseUser[] | null
  userData1: IDatabaseUser | IDatabaseUser[] | null
  userData2: IDatabaseUser | IDatabaseUser[] | null
}

export interface ICurrentRoom {
  isLoading: boolean
  isLoadingMessages: boolean
  isRoomMember: boolean
  messages: IDatabaseMessage[] | null
  myMessage: string
  roomData: Database["public"]["Tables"]["rooms"]["Row"] | null
  roomNotFound: boolean
  roomParticipants: IDatabaseParticipants[] | null
  usersTyping: IUsersTyping[]
}

interface IFriendships {
  friends: IFriend[]
  pending: IFriend[]
  requests: IFriend[]
}

export interface IUnreadMessages {
  message_count: number
  room_id: string
}

interface IGlobalStateValues {
  app: IApp
  currentRoom: ICurrentRoom
  dms: IRoom[]
  preferences: IPreferences
  relationships: IFriendships
  rooms: IRoom[]
  unreadMessages: IUnreadMessages[]
  user: IUser
}

export interface IGlobalState extends IGlobalStateValues {
  addNewCurrentRoomMessage: ({
    newMessage,
    supabase
  }: {
    newMessage: IDatabaseMessage
    supabase: SupabaseClient<Database>
  }) => void
  clearState: () => void
  setApp: (state: Partial<IApp>) => void
  setCurrentRoom: (state: Partial<ICurrentRoom>) => void
  setDms: (state: IRoom[]) => void
  setFriendships: (state: Partial<IFriendships>) => void
  setPreferences: (state: Partial<IPreferences>) => void
  setRooms: (state: IRoom[]) => void
  setState: (state: Partial<IGlobalStateValues>) => void
  setUnreadMessages: (state: IUnreadMessages[]) => void
  setUser: (state: Partial<IUser>) => void
}

export const initialState: IGlobalStateValues = {
  rooms: [],
  unreadMessages: [],
  dms: [],
  relationships: {
    friends: [],
    requests: [],
    pending: []
  },
  user: {
    email: null,
    name: null,
    uid: null,
    avatar_url: null,
    registerComplete: false,
    location: null,
    details: {},
    signed_tos: false
  },
  currentRoom: {
    isLoadingMessages: false,
    isLoading: false,
    isRoomMember: false,
    myMessage: "",
    roomData: null,
    roomNotFound: false,
    roomParticipants: null,
    messages: null,
    usersTyping: []
  },
  app: {
    isTldrMenuOpen: false,
    isMobileMenuOpen: false,
    messageAccordionSelected: "chat-rooms",
    onlineUsers: null,
    isLoadingRooms: false,
    isLoading: false,
    mainActiveSideMenu: "Friends",
    secondaryActiveSideMenu: null,
    registerUserActiveStep: 0
  },
  preferences: {
    theme: "system"
  }
}

const useGlobalStore = create<IGlobalState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,
        addNewCurrentRoomMessage: async ({
          newMessage,
          supabase
        }): Promise<void> => {
          const formattedMessage = newMessage

          const { data: user, error } = await supabase
            .from("accounts")
            .select("*")
            .eq("id", newMessage.user_id)
            .single()

          if (!user || error) {
            formattedMessage.userData = null
          } else {
            formattedMessage.userData = user
          }

          const newCurrentRoom = get().currentRoom

          if (newCurrentRoom.roomData?.id === newMessage.room_id) {
            newCurrentRoom.messages?.push(formattedMessage)

            set((state) => ({
              currentRoom: {
                ...state.currentRoom,
                ...newCurrentRoom
              }
            }))
          }
        },
        setPreferences: (newPreferences): void => {
          set((state) => ({
            preferences: {
              ...state.preferences,
              ...newPreferences
            }
          }))
        },
        setFriendships: (newFriendships): void => {
          set((state) => ({
            relationships: {
              ...state.relationships,
              ...newFriendships
            }
          }))
        },
        setRooms: (newRooms): void => {
          set(() => ({
            rooms: newRooms
          }))
        },
        setUnreadMessages: (newUnreadMessages): void => {
          set(() => ({
            unreadMessages: newUnreadMessages
          }))
        },
        setDms: (newRooms): void => {
          set(() => ({
            dms: newRooms
          }))
        },
        setCurrentRoom: (newCurrentRoom): void => {
          set((state) => ({
            currentRoom: {
              ...state.currentRoom,
              ...newCurrentRoom
            }
          }))
        },
        setApp: (newApp): void => {
          set((state) => ({
            app: {
              ...state.app,
              ...newApp
            }
          }))
        },
        setUser: (newUser): void => {
          set((state) => ({
            user: {
              ...state.user,
              ...newUser
            }
          }))
        },
        setState: (newState): void => {
          set((state) => ({ ...state, ...newState }))
        },
        clearState: (): void => {
          set({ ...initialState })
        }
      }),
      {
        name: "global-store"
      }
    )
  )
)

export default useGlobalStore
