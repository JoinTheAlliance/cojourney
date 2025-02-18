import {
  Alert,
  Button,
  Flex,
  Loader,
  Text,
  Title,
  Tooltip
} from "@mantine/core"
import React, { useState } from "react"
import { X } from "react-feather"
import useGlobalStore from "../../../store/useGlobalStore"
import UserAvatarWithIndicator from "../../UserAvatarWithIndicator/UserAvatarWithIndicator"
import getFriend from "../../../utils/getFriend"
import UserPopup from "../../UserPopup/UserPopup"
import useHandleFriendsRequests from "../../../Hooks/relationships/useHandleFriendRequests"
import { getAvatarImage } from "../../../helpers/getAvatarImage"

const FriendsPendingList = (): JSX.Element => {
  const {
    relationships: { pending },
    user
  } = useGlobalStore()

  const { isLoading, handleDeleteFriendship } = useHandleFriendsRequests()

  const [loadingElement, setLoadingElement] = useState<number | null>(null)

  if (pending.length === 0) {
    return (
      <p>No pending connections</p>
    )
  }

  return (
    <div>
      <Alert title="Hold on, it might take a minute">
        They may answer today, tomorrow or never... Or they already accepted
        your request and the app hasn&apos;t updated yet (that happens
        sometimes), refresh the page if you wanna be sure.
      </Alert>
      {pending.map((friendship) => {
        const { friendData } = getFriend({
          friendship,
          userId: user.uid || ""
        })

        if (!friendData) return null

        return (
          <Flex
            sx={{
              padding: 5,
              borderRadius: 5,
              cursor: "pointer"
            }}
            key={friendship.id}
            align="center"
            justify="space-between"
            mt={10}
          >
            <Flex>
              <UserPopup>
                <UserAvatarWithIndicator
                  image={friendData?.avatar_url || getAvatarImage(friendData?.name || friendData?.email || "")}
                  size={40}
                  user_email={friendData.email || ""}
                  checkOnline
                />
              </UserPopup>

              <div style={{ marginLeft: 10 }}>
                <Flex>
                  <Title
                    mr={10}
                    size={16}
                    lineClamp={1}
                  >
                    {friendData.name}
                  </Title>
                </Flex>
                <Text
                  c="dimmed"
                  size={14}
                  lineClamp={1}
                >
                  {friendData.email}
                </Text>
              </div>
            </Flex>
            <Tooltip
              withinPortal
              label="Cancel friend request"
              withArrow
            >
              <Button
                color="red"
                variant="light"
                onClick={() => {
                  setLoadingElement(friendship.id)

                  handleDeleteFriendship({ friendship }).finally(() => {
                    setLoadingElement(null)
                  })
                }}
              >
                {isLoading && loadingElement === friendship.id
? (
                  <Loader
                    color="red"
                    size={14}
                  />
                )
: (
                  <X size={14} />
                )}
              </Button>
            </Tooltip>
          </Flex>
        )
      })}
    </div>
  )
}

export default FriendsPendingList
