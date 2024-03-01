import { useSupabaseClient } from "@supabase/auth-helpers-react"
import React, { useEffect, useState } from "react"
import useGlobalStore from "../../../../store/useGlobalStore"
import { type Database } from "../../../../../types/database.types"

const agentId = "00000000-0000-0000-0000-000000000000"

interface Props {
  roomData: Database["public"]["Tables"]["rooms"]["Row"]
  setInputHandler: (content: {
    send: (content: string) => void
  }) => void
}

const AgentBinding = ({ roomData, setInputHandler }: Props) => {
  const supabase = useSupabaseClient()
  const [lastMessageCount, setLastMessageCount] = useState(0)
  const [lastRoomId, setLastRoomId] = useState("")
  const {
    currentRoom: { messages },
    user: { uid }
  } = useGlobalStore()

  const userId = uid!

  useEffect(() => {
    if (!supabase || !userId) return
    // if roomData ID same as lastRoomId
    // and messages length is same as lastMessageCount, return
    if (roomData?.id === lastRoomId && messages?.length === lastMessageCount) {
      return
    }
    setLastRoomId(roomData?.id)
    setLastMessageCount(messages?.length || 0)

    async function startAgent (): Promise<void> {
      const {
        data: { session }
      } = await supabase.auth.getSession()

      // Function to simulate agent's response
      if (setInputHandler) {
      setInputHandler({
        send: async (content: string) => {
          console.log("sending roomData")
          await fetch(`${import.meta.env.VITE_SERVER_URL ?? "http://localhost:7998"}/api/agents/message`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${(session!).access_token}`
            },
            body: JSON.stringify({
              senderId: session?.user.id,
              content: { content },
              agentId,
              room_id: roomData?.id
            })
          })
        }
      })
      return undefined
    }
  }

    startAgent()
  }, [supabase, userId])

  return <></>
}

export default AgentBinding
