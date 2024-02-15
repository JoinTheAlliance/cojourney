import { useSupabaseClient } from "@supabase/auth-helpers-react"
import React, { useEffect, useState } from "react"
import { type Database } from "../../../../types/database.types"
import useGetRoomMessages from "../../../Hooks/rooms/useGetRoomMessages"
import useListenToMessagesChanges from "../../../Hooks/rooms/useListenToMessagesChanges"
import useLoadUnreadMessages from "../../../Hooks/rooms/useLoadUnreadMessages"
import useTypingStatus from "../../../Hooks/rooms/useTypingStatus"
import useGlobalStore from "../../../store/useGlobalStore"
import AgentBinding from "./AgentBinding/AgentBinding"
import Messages from "./Messages/Messages"
import MessagesTextInput from "./MessagesTextInput/MessagesTextInput"
import RoomHeader from "./RoomHeader/RoomHeader"
import useRoomStyles from "./useRoomStyles"

interface Props {
  getRoomData: () => Promise<void>
  roomId: string
}

const Room = ({ roomId, getRoomData }: Props): JSX.Element => {
  const supabase = useSupabaseClient<Database>()
  const { classes } = useRoomStyles()
  const {
    currentRoom: { roomData, isRoomMember }
  } = useGlobalStore()

  const [inputHandler, setInputHandler] = useState(null)

  const { getRoomMessages } = useGetRoomMessages()
  const { getUnreadMessages } = useLoadUnreadMessages()

  const roomChannel = supabase.channel(roomId)

  useListenToMessagesChanges({ getRoomData })
  useTypingStatus({ roomChannel })

  useEffect(() => {
    if (!roomData?.id) return

    const fetchData = async () => {
      getRoomMessages({ roomId: roomData.id })
      await getUnreadMessages()
    }

    fetchData()
  }, [roomData])

  return (
    <div>
      <AgentBinding
        // @ts-expect-error
        roomData={roomData}
        // @ts-expect-error
        setInputHandler={setInputHandler}
      />
      <div className={classes.headerContainer}>
        <RoomHeader />
      </div>
      <div className={classes.messagesContainer}>
        <Messages />
      </div>
      {isRoomMember && (
        <div className={classes.textInputContainer}>
          <MessagesTextInput
            roomChannel={roomChannel}
            inputHandler={inputHandler}
          />
        </div>
      )}
    </div>
  )
}

export default Room
