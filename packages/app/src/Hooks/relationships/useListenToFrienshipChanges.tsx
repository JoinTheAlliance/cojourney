import {
  type Session,
  useSession,
  useSupabaseClient
} from "@supabase/auth-helpers-react"
import { useEffect } from "react"
import { showNotification } from "@mantine/notifications"
import { type Database } from "../../../types/database.types"
import useGlobalStore from "../../store/useGlobalStore"

interface Props {
  getUserFriends: (session: Session) => Promise<void>
  getUserRoomData: (session: Session) => Promise<void>
}

const useListenToFriendshipChanges = ({
  getUserFriends,
  getUserRoomData
}: Props) => {
  const supabase = useSupabaseClient<Database>()
  const session = useSession()

  const {
    user: { uid }
  } = useGlobalStore()

  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel("relationships-changes")
      .on(
        // @ts-expect-error
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "relationships"
        },
        (payload: {
          new: {
            status: string
            user_id: string
          }
        }) => {
          getUserFriends(session)
          getUserRoomData(session)

          if (
            payload.new.status === "PENDING" &&
            payload.new.user_id !== uid
          ) {
            showNotification({
              title: "Yoo",
              message: "You just got a friend request"
            })
          } else if (
            payload.new.status === "FRIENDS" &&
            payload.new.user_id !== uid
          ) {
            showNotification({
              title: "You got a new friend!",
              message:
                "Someone just accepted your friend request, go check out who it is"
            })
          }
        }
      )
      .subscribe()

    // eslint-disable-next-line consistent-return
    return () => {
      channel.unsubscribe()
    }
  }, [session])
}

export default useListenToFriendshipChanges
