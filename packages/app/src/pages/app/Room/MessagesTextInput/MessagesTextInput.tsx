import { ActionIcon, Loader, Text, TextInput } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { type RealtimeChannel } from "@supabase/supabase-js"
import React, { useEffect, useState } from "react"
import { Send } from "react-feather"
import { type Database } from "../../../../../types/database.types"
import useTypingBroadCast from "../../../../Hooks/rooms/useTypingBroadcast"
import useGlobalStore from "../../../../store/useGlobalStore"
import { v4 as uuidv4 } from "uuid"

interface Props {
  roomChannel: RealtimeChannel
  onMessageSent: (data: unknown) => void
}

const MessagesTextInput = ({
  roomChannel,
  onMessageSent
}: Props): JSX.Element => {
  const session = useSession()
  const supabase = useSupabaseClient<Database>()

  const {
    currentRoom: { roomData, usersTyping, myMessage },
    setCurrentRoom
  } = useGlobalStore()

  const [message, setMessage] = useState("")
  const [isSendingMessage, setIsSendingMessage] = useState(false)

  useTypingBroadCast({ roomChannel, message })

  useEffect(() => {
    if (myMessage && myMessage.length >= 1) {
      setMessage(myMessage)
    }
  }, [myMessage])

  const getUsersTypingMessage = () => {
    if (!usersTyping) return false

    if (usersTyping.length === 1) {
      return `${usersTyping[0].name} is typing...`
    }

    if (usersTyping.length === 2) {
      return `${usersTyping[0].name} and ${usersTyping[1].name} are typing...`
    }

    if (usersTyping.length >= 3) {
      return "Multiple people typing..."
    }

    return true
  }

  const onMessageSend = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("onMessageSend called", e)
    e.preventDefault()

    setCurrentRoom({
      myMessage: ""
    })

    const noMessageNotification = [
      "At least type something",
      "Message is empty!",
      "I think you forgot to type something",
      "Wow, sending a message with no message"
    ]

    const ranInt = Math.floor(Math.random() * 4)

    if (message.length <= 0) {
      showNotification({
        title: "Error",
        color: "red",
        variant: "filled",
        message: `${noMessageNotification[ranInt]}`
      })

      return
    }

    if (!roomData?.id || !session?.user.id) {
      showNotification({
        title: "Error",
        message: "Unable to send message"
      })

      return
    }
    setMessage("")
    setIsSendingMessage(true)

    const messageObject = {
      id: uuidv4(),
      content: { content: message, action: "WAIT" },
      room_id: roomData.id,
      created_at: new Date().toISOString(),
      user_id: session.user.id
    }
    onMessageSent(messageObject)

    const { error } = await supabase
      .from("messages")
      // @ts-expect-error - we are adding id to the messageObject
      .insert(messageObject)

    setIsSendingMessage(false)

    if (error) {
      setIsSendingMessage(false)
      showNotification({
        title: "Error",
        message: "Unable to send message."
      })
    }
  }

  const sendButton = (): JSX.Element | null => {
    if (message.length <= 0) return <Send size={16} />

    return (
      <ActionIcon type="submit">
        {isSendingMessage && <Loader size={16} />}
      </ActionIcon>
    )
  }

  return (
    <form onSubmit={async (e): Promise<void> => { await onMessageSend(e) }}>
      <TextInput
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        onChange={(event): void => { setMessage(event.target.value) }}
        placeholder="Start typing..."
        rightSection={sendButton()}
        value={message}
        spellCheck="false"
        autoComplete="off"
      />
      <Text size={12}>{getUsersTypingMessage()}</Text>
    </form>
  )
}

export default MessagesTextInput
