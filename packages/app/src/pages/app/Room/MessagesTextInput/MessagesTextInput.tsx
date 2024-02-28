import { ActionIcon, Loader, Text, TextInput } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useSession } from "@supabase/auth-helpers-react"
import React, { useEffect, useState } from "react"
import { Send } from "react-feather"
import { type RealtimeChannel } from "@supabase/supabase-js"
import useGlobalStore from "../../../../store/useGlobalStore"
import useTypingBroadCast from "../../../../Hooks/rooms/useTypingBroadcast"

interface Props {
  inputHandler: { send: (message: string) => Promise<void> } | null
  roomChannel: RealtimeChannel
}

const MessagesTextInput = ({
  roomChannel,
  inputHandler
}: Props): JSX.Element => {
  const session = useSession()

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

    setIsSendingMessage(true)

    console.log("roomData", roomData)
    console.log("user_id", session.user.id)

    const userIds: string[] = []

    const roomDataRelationships = (roomData as unknown as { relationships: { user_a: string, user_b: string } }).relationships as unknown as Array<{ user_a: string, user_b: string }>

    // add all userIds from the roomData.relationships array, check user_a or user_b
    roomDataRelationships.forEach((relationship) => {
      if (!userIds.includes(relationship.user_a)) {
        userIds.push(relationship.user_a)
      }

      if (!userIds.includes(relationship.user_b)) {
        userIds.push(relationship.user_b)
      }
    })

    setIsSendingMessage(false)
    setMessage("")

    if (inputHandler?.send) {
      console.log("inputHandler", inputHandler)
      console.log('*****  inputHandler send:', message)
      await inputHandler.send(message)
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
