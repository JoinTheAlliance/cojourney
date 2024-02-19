import { Flex, Text, Title, useMantineTheme } from "@mantine/core"
import React from "react"
import { type IFriend, type IUser } from "../../../store/useGlobalStore"
import getFriend from "../../../utils/getFriend"
import UserAvatarWithIndicator from "../../UserAvatarWithIndicator/UserAvatarWithIndicator"
import UserPopup from "../../UserPopup/UserPopup"

const GuidesList = ({
  friends,
  user
}: {
  friends: IFriend[]
  user: IUser
}): JSX.Element => {
  const theme = useMantineTheme()

  if (friends.length === 0) {
    return <p>No guides yet!</p>
  }

  return (
    <div>
      {friends.map((friendship: IFriend) => {
        const { friendData } = getFriend({
          friendship,
          userId: user.uid || ""
        })

        if (!friendData) return null

        return (
          <UserPopup
            key={friendship.id}
          >
            <Flex
              sx={{
                padding: 5,
                borderRadius: 5,
                cursor: "pointer",
                ":hover": {
                  backgroundColor:
                    theme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[1]
                }
              }}
              key={friendship.id}
              align="center"
              mt={10}
            >
              <UserAvatarWithIndicator
                // @ts-expect-error
                image={friendData.avatar_url}
                size={40}
                // @ts-expect-error
                user_email={friendData.email}
                checkOnline
              />

              <div style={{ marginLeft: 10 }}>
                <Flex>
                  <Title
                    lineClamp={1}
                    mr={10}
                    size={16}
                  >
                    {friendData.name}
                  </Title>
                </Flex>
                <Text
                  lineClamp={1}
                  c="dimmed"
                  size={14}
                >
                  {friendData.email}
                </Text>
              </div>
            </Flex>
          </UserPopup>
        )
      })}
    </div>
  )
}

export default GuidesList
