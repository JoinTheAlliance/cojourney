import {
  AppShell,
  Paper,
  TextInput,
  Text,
  Stack,
  useMantineTheme,
  Footer
} from "@mantine/core"
import React, { useEffect, useRef, useState } from "react"
import { IconSend2 } from "@tabler/icons-react"
import userIcon from "../../../../../public/images/user.svg"
import backgroundImage from "../../../../../public/images/background-chat.svg"
import AppShellHeader from "../../../../components/Header"

// Message component to represent individual messages
const Message = ({ text, isSender }: { text: string, isSender: boolean }) => {
  const theme = useMantineTheme()
  const alignToRight = isSender
    ? { marginLeft: "auto" }
    : { marginRight: "auto" }
  const messageColor = isSender ? theme.colors.gray[8] : theme.colors.gray[9]

  return (
    <Paper
      radius="lg"
      py="sm"
      px="md"
      style={{
        maxWidth: "70%",
        backgroundColor: messageColor,
        ...alignToRight
      }}
    >
      <Text size="sm" color={theme.white}>
        {text}
      </Text>
    </Paper>
  )
}

// const UserAvatar = ({
//   src,
//   alt,
//   online
// }: {
//   src: string
//   alt: string
//   online: boolean
// }) => {
//   // Use inline styles or create a CSS module/class to style these components

//   return (
//     <Group position="center">
//       <div style={{ position: "relative" }}>
//         <Avatar src={src} alt={alt} size="md" radius="50%" />
//         <div
//           style={{
//             width: "10px",
//             height: "10px",
//             borderRadius: "50%",
//             backgroundColor: online ? "green" : "gray",
//             position: "absolute",
//             right: "0",
//             bottom: "0",
//             border: "1px solid white", // Adjust the color based on your app's background
//             transform: "translate(20%, 0%)" // Center the badge to the outer edge of the avatar
//           }}
//         />
//       </div>
//     </Group>
//   )
// }

function Chat () {
  const [newMessage, setNewMessage] = useState<string>("")
  const [messages, setMessages] = useState([
    {
      text: "Welcome! I'm CJ! I'm your guide here. Alright if we get to know each other?",
      sender: false
    },
    { text: "Hey CJ, sure.", sender: true },
    { text: "Test", sender: true },
    { text: "Welcome", sender: false },
    { text: "New Message", sender: true }
  ])

  const bottomRef = useRef<null | HTMLDivElement>(null)

  // Scroll to bottom every time messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" })
    }
  }, [messages])

  // Add new messages when send is pressed
  const handleMessageSend = () => {
    setMessages([...messages, { text: newMessage, sender: true }])
    setNewMessage("")
  }
  return (
    <AppShell
      padding="md"
      header={<AppShellHeader title="CJ" src={userIcon} online={true} />}
      styles={(theme) => ({
        main: {
          backgroundColor: theme.colors.dark[8],
          paddingBottom: "4rem",
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center"
        }
      })}
      footer={
        <Footer height={60} p="xs" bg={"transparent"} withBorder={false}>
          <TextInput
            size="md"
            value={newMessage}
            onChange={(event) => {
              // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
              setNewMessage(event.currentTarget.value)
            }}
            radius={"md"}
            placeholder="Write here..."
            rightSection={
              <IconSend2
                style={{
                  cursor: "pointer"
                }}
                onClick={handleMessageSend}
              />
            }
          />
        </Footer>
      }
    >
      <Stack>
        {messages.map(
          (
            message: {
              text: string
              sender: boolean
            },
            index: number
          ) => (
            <Message
              key={index}
              text={message.text}
              isSender={message.sender}
            />
          )
        )}
        <div ref={bottomRef} />
      </Stack>
    </AppShell>
  )
}

export default Chat
