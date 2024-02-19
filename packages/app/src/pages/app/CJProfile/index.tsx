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
import userIcon from "../../../../public/images/user-avatar-robot.svg"

export default function Profile () {
  const isMobile = useMediaQuery("(max-width: 900px)")
  const { classes: roomClasses } = useRoomStyles()

  const theme = useMantineTheme()

  return (
    <div>
      <div className={roomClasses.headerContainer}>
        <ProfileHeader title="CJ" />
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
              Cojourney Guide
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
            <Button mb={"lg"} fullWidth variant="transparent" size="md">
              <Text color={theme.colors.red[8]}>Reset Memories</Text>
            </Button>
          </Group>
        </Paper>
      </div>
    </div>
  )
}
