import { Box, ScrollArea, Skeleton } from "@mantine/core"
import React, { useEffect, useRef } from "react"
import useGlobalStore, { type IDatabaseMessages } from "../../../../store/useGlobalStore"

import EmptyRoom from "../../../../components/InfoScreens/EmptyRoom"
import Message from "./Message/Message"

const Messages = ({ userMessage }): JSX.Element => {
  console.log(userMessage)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView()
    // console.log("messagesEndRef.current scroll", messagesEndRef.current)
  }

  // console.log("messagesEndRef", messagesEndRef.current)
  console.log("userMessage", userMessage)
  const {
    user,
    currentRoom: { messages, isLoadingMessages }
  } = useGlobalStore()

  useEffect(() => {
    scrollToBottom()
  }, [messages?.length])

  if (isLoadingMessages) {
    return (
      <>
        <Skeleton
          h={30}
          mb={10}
          width="50%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="80%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="35%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="40%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="60%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="20%"
        />
        <Skeleton
          h={30}
          mb={10}
          width="30%"
        />
      </>
    )
  }

  if (!messages) return <p>Error loading messages</p>
  if (messages.length === 0) return <EmptyRoom />

  console.log("messages", messages)

//   {
//     "created_at": "2024-03-02T09:06:32.293347+00:00",
//     "user_id": "59c8a2f6-00fc-4caf-9aad-0acfdfa0bda3",
//     "content": {
//         "content": "hello"
//     },
//     "is_edited": false,
//     "room_id": "628fc3ba-b8f5-4b98-9347-92fab4f2551e",
//     "updated_at": null,
//     "user_ids": [
//         "59c8a2f6-00fc-4caf-9aad-0acfdfa0bda3",
//         "00000000-0000-0000-0000-000000000000"
//     ],
//     "id": "c3f3791a-b756-4d6f-bd05-7f32f5f95c6e",
//     "embedding": null,
//     "unique": true,
// }

  return (
    <ScrollArea
      w="100%"
      h="calc(100%)"
    >
      <Box>
        {(userMessage ? [...messages
          .filter(
            // filter out messages that match userMessage
            (message) => message.content.content !== userMessage.content.content
          ), { ...userMessage, userData: user }] : messages)
        .sort(
          // sort by created_at
          (a, b) => new Date(a.created_at as string).getTime() - new Date(b.created_at as string).getTime()
        ).map((message) => {
          return (
            <div key={message.created_at}>
              <Message
                key={message.id}
                message={message}
              />
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </Box>
    </ScrollArea>
  )
}

export default Messages
