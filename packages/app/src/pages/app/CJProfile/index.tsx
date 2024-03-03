import React from "react"
import {
  Container,
  Group,
  Paper,
  Text,
  Button,
  useMantineTheme
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import useRoomStyles from "../Room/useRoomStyles"
import ProfileHeader from "../../../components/ProfileHeader"
import UserAvatar from "../../../components/UserAvatar"
import useGlobalStore from "../../../store/useGlobalStore"

export default function Profile () {
  const isMobile = useMediaQuery("(max-width: 900px)")
  const { classes: roomClasses } = useRoomStyles()
  const {
    currentRoom: {
      roomData: {
        // @ts-expect-error
        relationships: [{ userData2: friend }]
      }
    }
  } = useGlobalStore()
  const theme = useMantineTheme()

  return (
    <div>
      <div className={roomClasses.headerContainer}>
        <ProfileHeader title={friend.name} />
      </div>
      <div
        className={roomClasses.messagesContainer}
        style={{
          alignItems: "center",
          display: "flex"
        }}
      >
        <Paper
          shadow="xs"
          radius="lg"
          p="xl"
          w={"100%"}
          mx={isMobile ? "0" : "8xl"}
        >
          <Container maw={"100%"} p={"xxl"} style={{}}>
            <UserAvatar src={friend.avatar_url} online={true} size={"lg"} />

            <Text
              align="center"
              size="md"
              color={theme.colors.gray[4]}
              mt={"xl"}
              weight={"600"}
            >
              {friend.name}
            </Text>
            <Group>
              <Text
                size="sm"
                color={theme.colors.gray[4]}
                mt={"2xl"}
                // mb={"sm"}
                weight={"400"}
                italic={true}
              >
                {friend.profile_line}
              </Text>
              <Text
                w={"100%"}
                align="right"
                size="sm"
                color={theme.colors.gray[4]}
                weight={"400"}
              >
                --{friend.name}
              </Text>
            </Group>
            <Group>
              <Text>Location: {friend.location || "Not specified"}</Text>
            </Group>
            <Group>
              <Text>Age: {friend.age || "Not specified"}</Text>
            </Group>
            <Group>
              <Text>Pronouns: {friend.pronouns || "Not specified"}</Text>
            </Group>
          </Container>
          <Group
            mb={"lg"}
            mt={"4xl"}
            style={{
              gap: theme.spacing.xs
            }}
          >
            <Button mb={"lg"} fullWidth variant="transparent" size="md">
              <Text color={theme.colors.red[8]}>Reset Memories</Text>
            </Button>
          </Group>
        </Paper>
      </div>
    </div>
  )
}
