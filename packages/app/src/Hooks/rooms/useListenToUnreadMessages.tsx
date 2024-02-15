import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useEffect } from "react"
import { type Database } from "../../../types/database.types"
import useLoadUnreadMessages from "./useLoadUnreadMessages"

const useListenToUnreadMessagesChanges = () => {
  const supabase = useSupabaseClient<Database>()
  const { getUnreadMessages } = useLoadUnreadMessages()
  const session = useSession()

  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel("table-db-changes-unread-messages")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages"
        },
        () => {
          getUnreadMessages()
        }
      )
      .subscribe()

    supabase.realtime.accessToken = session?.access_token // THIS IS REQUIRED FOR RLS!!!

    // eslint-disable-next-line consistent-return
    return () => {
      channel.unsubscribe()
    }
  }, [session])
}

export default useListenToUnreadMessagesChanges
