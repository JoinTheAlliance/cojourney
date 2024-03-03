import { Accordion, Badge, Text, useMantineTheme } from "@mantine/core"
import React, { useState } from "react"
import useGlobalStore from "../../../store/useGlobalStore"
import GuidesList from "../../Friends/GuidesList/GuidesList"
import FriendsList from "../../Friends/FriendsList/FriendsList"
import FriendsPendingList from "../../Friends/FriendsPendingList/FriendsPendingList"
import FriendsRequestsList from "../../Friends/FriendsRequestsList/FriendsRequestsList"

const FriendsSideMenuScreen = (): JSX.Element => {
  const {
    user,
    relationships: { friends, requests, pending }
  } = useGlobalStore()
  const theme = useMantineTheme()

  // get friend from friends where id is uuid 0s
  const defaultFriends = friends.filter(
    (friend) => friend.user_b === "00000000-0000-0000-0000-000000000000"
  )
  const notDefaultFriends = friends.filter(
    (friend) => friend.user_b !== "00000000-0000-0000-0000-000000000000"
  )
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "guides"
  )

  return (
    <>
      <Accordion m={10} value={activeAccordion} onChange={setActiveAccordion}
      style={{
        height: "calc(100vh - 18vh)",
        overflow: "auto"
      }}>
        <Accordion.Item value="guides">
          <Accordion.Control px={"xs"}>
            <Text weight={700} color={theme.white}>
              {"Guides"}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <GuidesList user={user} friends={defaultFriends} />
          </Accordion.Panel>
        </Accordion.Item>

        <Accordion.Item value="friends">
          <Accordion.Control px={"xs"}>
            <Text weight={700} color={theme.white}>
              {"Connections"}
            </Text>
          </Accordion.Control>
          <Accordion.Panel>
            <FriendsList user={user} friends={notDefaultFriends} />
          </Accordion.Panel>
        </Accordion.Item>

        {/* <Accordion.Item value="requests">
          <Accordion.Control px={"xs"}>
            <Text weight={700} color={theme.white}>
              {"Requests"}
            </Text>
            {requests.length !== 0 && (
              <Badge color="red" variant="filled" ml={5}>
                {requests.length}
              </Badge>
            )}
          </Accordion.Control>
          <Accordion.Panel>
            <FriendsRequestsList />
          </Accordion.Panel>
        </Accordion.Item>
        <Accordion.Item value="pending">
          <Accordion.Control px={"xs"}>
            <Text weight={700} color={theme.white}>
              {"Pending"}
            </Text>
            {pending.length !== 0 && <Badge ml={5}>{pending.length}</Badge>}
          </Accordion.Control>
          <Accordion.Panel>
            <FriendsPendingList />
          </Accordion.Panel>
        </Accordion.Item> */}
      </Accordion>
    </>
  )
}

export default FriendsSideMenuScreen
