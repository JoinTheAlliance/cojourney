import React from "react"
import { useNavigate } from "react-router-dom"
import {
  Container,
  Group,
  Paper,
  Text,
  Button,
  useMantineTheme
} from "@mantine/core"
import { useMediaQuery } from "@mantine/hooks"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { type Database } from "../../../../types/database.types"
import useRoomStyles from "../Room/useRoomStyles"
import ProfileHeader from "../../../components/ProfileHeader"
import UserAvatar from "../../../components/UserAvatar"
import useGlobalStore from "../../../store/useGlobalStore"
import useHandleFriendsRequests from "../../../Hooks/relationships/useHandleFriendRequests"

export default function Profile () {
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 900px)")
  const supabase = useSupabaseClient<Database>()
  const { classes: roomClasses } = useRoomStyles()

  const {
    // @ts-expect-error
    currentRoom: { roomData: { relationships: [ friendship ] } },
    // @ts-expect-error
    currentRoom: { roomData: { relationships: [{ userData2: friend }] } }
  } = useGlobalStore()

  const { handleDeleteFriendship } = useHandleFriendsRequests()

  const unfriend = () => {
    handleDeleteFriendship({friendship})
  }

  const logout = () => {
    supabase.auth.signOut()
    navigate("/login")
  }

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
              8 Mutual Connections
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
                I&apos;m here for anything you need. No problem is too big or
                too small!
              </Text>
              <Text
                w={"100%"}
                align="right"
                size="sm"
                color={theme.colors.gray[4]}
                weight={"400"}
              >
                -- {friend.name}
              </Text>
            </Group>
          </Container>
          <Group
            mb={"lg"}
            mt={"4xl"}
            style={{
              gap: theme.spacing.xs
            }}
          >
            <Button fullWidth variant="transparent" size="md" onClick={unfriend}>
              <Text color={theme.white}>Unfriend</Text>
            </Button>
            <Button fullWidth variant="transparent" size="md" onClick={logout}>
              <Text color={theme.colors.red[8]}>Block</Text>
            </Button>
          </Group>
        </Paper>
      </div>
    </div>
  )
}