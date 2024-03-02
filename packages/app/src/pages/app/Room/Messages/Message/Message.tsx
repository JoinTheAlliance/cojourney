import {
  Flex,
  HoverCard,
  Text
} from "@mantine/core"
import moment from "moment"
import React from "react"
import UserAvatarWithIndicator from "../../../../../components/UserAvatarWithIndicator/UserAvatarWithIndicator"
import UserPopup from "../../../../../components/UserPopup/UserPopup"
import {
  type IDatabaseMessage
} from "../../../../../store/useGlobalStore"
import useMessageStyles from "../useMessageStyles"

interface Props {
  message: IDatabaseMessage
}

const Message = ({ message }: Props): JSX.Element => {
  const { classes } = useMessageStyles()

  return (
    <div>
      <HoverCard
        shadow="md"
        position="top-end"
        closeDelay={0}
        openDelay={0}
        offset={-15}
        withinPortal
      >
        <HoverCard.Target>
          <Flex
            key={message.id}
            mb={10}
            className={classes.messageDiv}
            justify="space-between"
          >
            <Flex>
              <div className={classes.avatarDiv}>
                <UserPopup>
                  <UserAvatarWithIndicator
                    // @ts-expect-error
                    user_email={message.userData.email}
                    size={30}
                    // @ts-expect-error
                    image={message.userData.avatar_url}
                  />
                </UserPopup>
              </div>
              <div style={{ marginLeft: 10 }}>
                <Text c="dimmed" size={14}>
                  {/* @ts-expect-error */}
                  {`${message.userData.name} - ${moment(
                    message.created_at
                  ).fromNow()}`}
                </Text>
                  <Text>{message.content?.content}</Text>
              </div>
            </Flex>
          </Flex>
        </HoverCard.Target>
      </HoverCard>
    </div>
  )
}

export default Message
