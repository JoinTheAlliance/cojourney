import { AppShell, Header, Paper, TextInput, Text, Stack, useMantineTheme, Footer, Flex, rem, Avatar, Group } from "@mantine/core"
import React, { useEffect, useRef, useState } from "react"
import { IconSend2, IconDots, IconChevronLeft } from "@tabler/icons-react"
import userIcon from "../../../../../public/images/user.svg"

// Message component to represent individual messages
const Message = ({ text, isSender }: { text: string, isSender: boolean }) => {
  const theme = useMantineTheme()
  const alignToRight = isSender ? { marginLeft: "auto" } : { marginRight: "auto" }
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

const UserAvatar = ({ src, alt, online }: { src: string, alt: string, online: boolean }) => {
  // Use inline styles or create a CSS module/class to style these components

  return (
    <Group position="center">
      <div style={{ position: "relative" }}>
        <Avatar src={src} alt={alt} size="md" radius="50%" />
        <div style={{
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    backgroundColor: online ? "green" : "gray",
    position: "absolute",
    right: "0",
    bottom: "0",
    border: "1px solid white", // Adjust the color based on your app's background
    transform: "translate(20%, 0%)" // Center the badge to the outer edge of the avatar
  }} />
      </div>
    </Group>
  )
}

function Chat () {
  const theme = useMantineTheme()
  const [newMessage, setNewMessage] = useState<string>("")
  const [messages, setMessages] = useState([
    { text: "Welcome! I'm CJ! I'm your guide here. Alright if we get to know each other?", sender: false },
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
      header={<Header display={"flex"} height={60} px="xl" bg={theme.colors.dark[8]} withBorder={false}>

    <Flex
      direction={"row"}
      gap={"xl"}
      align={"center"}
      style={{
        width: "100%"
        // justifyContent: "space-between"
      }}
      justify='space-between'
    >
    <IconChevronLeft
    style={{
      cursor: "pointer",
      width: rem(32),
      height: rem(32)
    }}/>
    <Flex
      direction={"row"}
      gap={"xl"}
      align={"center"}
      style={{
        cursor: "pointer"

        // width: "100%"
        // justifyContent: "space-between"
      }}
      justify='center'
      columnGap={"sm"}
    >
            <UserAvatar src={userIcon} alt="User avatar" online={true} />

      {/* <Avatar src={userIcon} /> */}
      <div>
      <Text size={"lg"} weight={"800"} style={{
        lineHeight: 1
      }}>CJ</Text>
      <Text size={"xs"}>Online</Text>
      </div>

    </Flex>

    <IconDots
    style={{
      cursor: "pointer",
      width: rem(32),
      height: rem(32)
    }}/>
      {/* <IconDots
      size={"sm"}
      style={{
        cursor: "pointer"
      }}
      /> */}
    </Flex>

      </Header>}
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.dark[8],
        paddingBottom: "4rem" }
      })}
      footer={<Footer height={60} p="xs" bg={theme.colors.dark[8]} withBorder={false}>
              <TextInput
      size="md"
      value={newMessage}
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      onChange={(event) => { setNewMessage(event.currentTarget.value) }}
        radius={"md"}
        placeholder="Type a message"
        rightSection={
          <IconSend2 style={{
            cursor: "pointer"
          }}
          onClick={handleMessageSend}
          />
        }
      />
      </Footer>}
    >
      <Stack>
        {messages.map((message: {
          text: string
          sender: boolean
        }, index: number) => (
          <Message key={index} text={message.text} isSender={message.sender} />
        ))}
        <div ref={bottomRef} />
      </Stack>
    </AppShell>
  )
}

export default Chat
