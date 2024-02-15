import { Avatar, Flex, Tooltip } from "@mantine/core"
import React from "react"
import { MoreHorizontal } from "react-feather"
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

  return (
    <div style={{ zIndex: "9999" }}>
      <div className={classes.container}>
        <div className={classes.headerLeft}>
          <div className={classes.participants}>
            <Avatar.Group spacing="sm">
              {roomParticipants.slice(0, 3).map((participant) => {
                if (!participant.userData) return null

                return (
                  <Tooltip
                    key={participant.id}
                    // @ts-expect-error
                    label={participant.userData.name}
                    withArrow
                  >
                    <div>
                      <UserAvatarWithIndicator
                        // @ts-expect-error
                        image={participant.userData.avatar_url}
                        size={40}
                        // @ts-expect-error
                        user_email={participant.userData.email}
                      />
                    </div>
                  </Tooltip>
                )
              })}
              {roomParticipants.length > 3 && (
                <Avatar radius="xl">{`+${roomParticipants.length - 3}`}</Avatar>
              )}
            </Avatar.Group>
          </div>
        </div>
        <Flex align="center">
          <Tooltip
            withArrow
            label="CJ Profile"
          >
            <MoreHorizontal
              style={{ cursor: "pointer", color: "#757474" }}
              onClick={() => { navigate("/cjprofile") }}
            />
          </Tooltip>
        </Flex>
        {/* <Flex align="center">
          <Tooltip
            withArrow
            label="Use AI tools to help you write your messages, or to be a menace to your friends."
          >
            <Button
              onClick={() => {
                setApp({
                  isTldrMenuOpen: true,
                });
              }}
              mr={10}
              variant="light"
            >
              ChatGPT
            </Button>
          </Tooltip>
          {isMobile && (
            <Tooltip
              label="Room Settings"
              withArrow
            >
              <ActionIcon
                color="blue"
                onClick={(): void => setIsRoomSettingsOpened(true)}
                size="xl"
              >
                <Settings size={20} />
              </ActionIcon>
            </Tooltip>
          )}
        </Flex> */}
      </div>
    </div>
  )
}

export default RoomHeader
