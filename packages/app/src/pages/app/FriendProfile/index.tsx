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
import userIcon from "../../../../public/images/user-avatar-robot.svg"

export default function Profile () {
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 900px)")
  const supabase = useSupabaseClient<Database>()
  const { classes: roomClasses } = useRoomStyles()

  const logout = () => {
    supabase.auth.signOut()
    navigate("/login")
  }

  const theme = useMantineTheme()

  return (
    <div>
      <div className={roomClasses.headerContainer}>
        <ProfileHeader title="John Doe" />
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
            <UserAvatar src={userIcon} online={true} size={"lg"} />

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
                --CJ
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
            <Button fullWidth variant="transparent" size="md">
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
