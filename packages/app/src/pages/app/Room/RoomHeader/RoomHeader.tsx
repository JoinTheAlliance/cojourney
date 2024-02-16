import { Flex, Group, Tooltip, Text, useMantineTheme } from "@mantine/core"
import React from "react"
import { useNavigate } from "react-router-dom"
import UserAvatarWithIndicator from "../../../../components/UserAvatarWithIndicator/UserAvatarWithIndicator"
import useGlobalStore from "../../../../store/useGlobalStore"
import useRoomHeaderStyles from "./useRoomHeaderStyles"

const RoomHeader = (): JSX.Element => {
  const { classes } = useRoomHeaderStyles()
  const {
    currentRoom: { roomData, roomParticipants }
  } = useGlobalStore()
  const navigate = useNavigate()

  if (!roomData || !roomParticipants) {
    return <p>Error</p>
  }
  const theme = useMantineTheme()

  return (
    <div style={{ zIndex: "9999" }}>
      <div className={classes.container}>
        <div className={classes.headerLeft}>
          <div className={classes.participants}>
            <Group
              noWrap
              onClick={() => {
                navigate("/cjprofile")
              }}
            >
              <Tooltip
                key={roomParticipants[roomParticipants.length - 1].id}
                // @ts-expect-error
                label={roomParticipants[roomParticipants.length - 1].userData.name}
                withArrow
              >
                <div>
                  <UserAvatarWithIndicator
                    // @ts-expect-error
                    image={roomParticipants[roomParticipants.length - 1].userData.avatar_url}
                    size={40}
                    // @ts-expect-error
                    user_email={roomParticipants[roomParticipants.length - 1].userData.email}
                  />
                </div>
              </Tooltip>
              <Group display={"block"}>
                <Flex align={"baseline"}>
                  <Text color={theme.white} weight={500}>
                    {"CJ"}
                  </Text>
                </Flex>
                <Text size="xs" color="dimmed">
                  {"Online"}
                </Text>
              </Group>
            </Group>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RoomHeader
