import {
  type Session,
  useSession,
  useSupabaseClient
} from "@supabase/auth-helpers-react"
import { useCallback, useEffect } from "react"
import useGlobalStore, {
  type IDatabaseRoom,
  type IFriend
} from "../store/useGlobalStore"
import { type Database } from "../../types/database.types"
import useHandleSignout from "./useHandleSignout"
import { getAvatarImage } from "../helpers/getAvatarImage"

const useLoadUserData = () => {
  const supabase = useSupabaseClient<Database>()
  const { handleSignout } = useHandleSignout()
  const s = useSession()

  const { setUser, setApp, setRooms, setFriendships, setDms } =
    useGlobalStore()

  const getUserSession = useCallback(async () => {
    const {
      data: { user }
    } = await supabase.auth.getUser()

    if (!user) { await handleSignout(); return }

    return null
  }, [])

  const getUserData = useCallback(async (session: Session): Promise<void> => {
    if (!session) return

    const { data, error } = await supabase
      .from("accounts")
      .select("*")
      .eq("id", session?.user.id)
      .single()

    if (error || !data) {
      setUser({
        registerComplete: false,
        uid: null
      })

      return
    }

    setUser({
      name: data?.name,
      email: data?.email,
      avatar_url: data?.avatar_url || getAvatarImage(data?.name || data?.email || ""),
      uid: data?.id
    })
  }, [])

  const getUserRoomData = useCallback(
    async (session: Session): Promise<void> => {
      if (!session) return

      setRooms([])
      setApp({ isLoadingRooms: true })

      const { data, error } = await supabase
        .from("rooms")
        .select(
          `*,
        relationships(
          *,
          userData1:accounts!relationships_user_a_fkey(
            *
          ),
          userData2:accounts!relationships_user_b_fkey(
            *
          ),
          actionUserData:accounts!relationships_user_id_fkey(
            *
          )
        ),
        participants!inner(
          *,
          userData:accounts(
            *
          )
        )
        `
        )
        .filter("participants.user_id", "eq", session.user.id)

      if (error || !data) {
        setApp({ isLoadingRooms: false })
        return
      }

      const newDms: IDatabaseRoom[] = []
      const newRooms: IDatabaseRoom[] = []

      data.forEach((room) => {
        if (room?.relationships[0]) {
          newDms.push(room)
          return
        }

        newRooms.push(room)
      })

      // @ts-expect-error
      setRooms(newRooms)
      // @ts-expect-error
      setDms(newDms)

      setTimeout(() => {
        setApp({ isLoadingRooms: false })
      }, 2000)
    },

    []
  )

  const getUserFriends = useCallback(
    async (session: Session): Promise<void> => {
      if (!session) return

      setFriendships({
        friends: [],
        requests: [],
        pending: []
      })

      const { data, error } = await supabase.from("relationships").select(
        `*,
        userData1:accounts!relationships_user_a_fkey(
          *
        ),
        userData2:accounts!relationships_user_b_fkey(
          *
        ),
        actionUserData:accounts!relationships_user_id_fkey(
          *
        )
      `
      )

      const requests: IFriend[] = []
      const friends: IFriend[] = []
      const pending: IFriend[] = []

      if (error || !data) {
        return
      }

      data.forEach((friendship) => {
        if (friendship.status === "PENDING") {
          if (friendship.user_id === session.user.id) {
            pending.push(friendship)
          } else {
            requests.push(friendship)
          }
        } else if (friendship.status === "FRIENDS") {
          return friends.push(friendship)
        }

        return null
      })

      setFriendships({
        friends,
        pending,
        requests
      })
    },

    []
  )

  useEffect(() => {
    if (!s) return

    setApp({
      isLoading: true
    })

    Promise.all([
      getUserData(s),
      getUserRoomData(s),
      getUserSession(),
      getUserFriends(s)
    ]).finally(() => {
      setApp({ isLoading: false })
    })
  }, [s, supabase])

  return { getUserData, getUserRoomData, getUserSession, getUserFriends }
}

export default useLoadUserData
