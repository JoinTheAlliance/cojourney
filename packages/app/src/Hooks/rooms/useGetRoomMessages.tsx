import { showNotification } from "@mantine/notifications"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { type Database } from "../../../types/database.types"
import useGlobalStore from "../../store/useGlobalStore"

interface IGetRoomMessages {
  roomId: string
}

const useGetRoomMessages = () => {
  const supabase = useSupabaseClient<Database>()
  const {
    setCurrentRoom
  } = useGlobalStore()

  const getRoomMessages = async ({
    roomId
  }: IGetRoomMessages): Promise<void> => {
    setCurrentRoom({
      isLoadingMessages: true
    })

    const { data, error } = await supabase
      .from("messages")
      .select("*, userData:accounts(*)")
      .eq("room_id", roomId)
      .limit(50)
      .order("created_at", { ascending: false })

    if (error) {
      showNotification({
        title: "Error",
        message: "Unable to get messages"
      }); return
    }

    if (data.length === 0) {
      setCurrentRoom({
        messages: [],
        isLoadingMessages: false
      }); return
    }

    const reversedMessages = data.reverse()

    // const { error: lastReadError } = await supabase
    //   .from("participants")
    //   .update({
    //     last_message_read: reversedMessages[reversedMessages.length - 1].id,
    //   })
    //   .eq("room_id", currentRoom.roomData?.id)
    //   .eq("user_id", uid);

    // if (lastReadError) {
    //   showNotification({
    //     title: "Error",
    //     message: "Unable to update last read message",
    //   });
    // }

    setCurrentRoom({
      messages: reversedMessages,
      isLoadingMessages: false
    })
  }

  return { getRoomMessages }
}

export default useGetRoomMessages
