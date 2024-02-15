import { type RealtimeChannel } from "@supabase/supabase-js"
import { useEffect } from "react"
import useGlobalStore, { type IUsersTyping } from "../../store/useGlobalStore"

interface Props {
  roomChannel: RealtimeChannel
}

const useTypingStatus = ({ roomChannel }: Props) => {
  const {
    setCurrentRoom,
    currentRoom: { usersTyping }
  } = useGlobalStore()

  roomChannel.subscribe((status) => {
    if (status === "SUBSCRIBED") {
      roomChannel.on("broadcast", { event: "typing" }, (data) => {
        const newUsersTyping = usersTyping

        const { payload } = data

        if (payload.isTyping) {
          if (!newUsersTyping.find((user) => user.email === payload.email)) {
            newUsersTyping?.push(payload as IUsersTyping)

            setCurrentRoom({ usersTyping: newUsersTyping })
          }
        } else {
          const removed = newUsersTyping.filter(
            (user) => user.email !== payload.email
          )

          setCurrentRoom({
            usersTyping: removed
          })
        }
      })
    }
  })

  useEffect(() => {
    return () => {
      roomChannel.unsubscribe()
    }
  }, [])
}

export default useTypingStatus
