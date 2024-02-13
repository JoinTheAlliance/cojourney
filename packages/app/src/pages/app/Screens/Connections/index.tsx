import React from "react"
import { Avatar, Text, Group, Stack, useMantineTheme, Header, Flex, rem, AppShell } from "@mantine/core"
import { IconDots, IconChevronLeft } from "@tabler/icons-react"
import userIcon from "../../../public/images/user.svg"

const connections = {
  cj: [
    { name: "CJ", online: true }
  ],
  new: [
    { name: "Avicii Ronaldo", online: true }
  ],
  friends: [
    { name: "Avicii Ronaldo", online: true }
  ],
  pending: [
    { name: "Avicii Ronaldo", online: false }
  ]
}

const UserAvatar = ({ src, alt, online }: { src: string, alt: string, online: boolean }) => {
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
    border: "1px solid white",
    transform: "translate(20%, 0%)"
  }} />
      </div>
    </Group>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ConnectionList = ({ title, list }: { title?: string, list: any[] }) => {
  const theme = useMantineTheme()

  return (
    <Stack spacing="xs" style={{ marginBottom: theme.spacing.md }}>
      <Text weight={600} size={"sm"} style={{ color: theme.colors.gray[4] }}>
        {title}
      </Text>
      {list.map((item, index) => (
        <Group
          key={index}
          noWrap
          position="apart"
          style={{
            backgroundColor: theme.colors.dark[6],
            borderRadius: theme.radius.md,
            padding: theme.spacing.sm,
            cursor: "pointer"
          }}
        >
          <Group noWrap>
          <UserAvatar src={userIcon} alt="User avatar" online={item.online} />

            <div>
              <Text weight={500}>{item.name}</Text>
              <Text size="xs" color="dimmed">
                {item.online ? "Online" : "Offline"}
              </Text>
            </div>
          </Group>
        </Group>
      ))}
    </Stack>
  )
}

const ConnectionsScreen = () => {
  const theme = useMantineTheme()

  return (
    <AppShell
    padding="md"
    header={
    <Header display={"flex"} height={60} bg={theme.colors.dark[8]} withBorder={false} px={"2xl"}>

  <Flex
    direction={"row"}
    gap={"xl"}
    align={"center"}
    style={{
      width: "100%"
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
    }}
    justify='center'
    columnGap={"sm"}
  >
    <div>
    <Text size={"lg"} weight={"800"} style={{
    }}>Connections</Text>
    </div>

  </Flex>

  <IconDots
  style={{
    cursor: "pointer",
    width: rem(32),
    height: rem(32)
  }}/>
  </Flex>

    </Header>}
    styles={(theme) => ({
      main: { backgroundColor: theme.colors.dark[8],
      paddingBottom: "4rem" }
    })}
  >
    <Stack
      spacing="md"
      style={{
        backgroundColor: theme.colors.dark[8],
        padding: theme.spacing.md
      }}
    >

      <ConnectionList list={connections.cj} />
      <ConnectionList title="New" list={connections.new} />
      <ConnectionList title="Friends" list={connections.friends} />
      <ConnectionList title="Pending" list={connections.pending} />
    </Stack>
  </AppShell>

  )
}

export default ConnectionsScreen
