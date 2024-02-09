import { Accordion, Badge, Tabs } from "@mantine/core";
import React, { useState } from "react";
import { Clock, PhoneIncoming, Users } from "react-feather";
import useGlobalStore from "../../../store/useGlobalStore";
import FriendsList from "../../Friends/FriendsList/FriendsList";
import FriendsRequestsList from "../../Friends/FriendsRequestsList/FriendsRequestsList";
import FriendsPendingList from "../../Friends/FriendsPendingList/FriendsPendingList";

const FriendsSideMenuScreen = (): JSX.Element => {
  const {
    user,
    relationships: { friends, requests, pending },
  } = useGlobalStore();

  // get friend from friends where id is uuid 0s
  const defaultFriends = friends.filter(
    (friend) => friend.user_b === "00000000-0000-0000-0000-000000000000",
  );
  const notDefaultFriends = friends.filter(
    (friend) => friend.user_b !== "00000000-0000-0000-0000-000000000000",
  );
  const [activeAccordion, setActiveAccordion] = useState<string | null>(
    "guides",
  );

  return (
    <>
      <FriendsList
        user={user}
        friends={defaultFriends}
      />
      <Accordion
        m={10}
        variant="separated"
        value={activeAccordion}
        onChange={setActiveAccordion}
      >
        <Accordion.Item value="friends">
          <Accordion.Control>{`Friends ${notDefaultFriends.length}`}</Accordion.Control>
          <Accordion.Panel>
            <FriendsList
              user={user}
              friends={notDefaultFriends}
            />
          </Accordion.Panel>
        </Accordion.Item>

        {requests.length > 0 && (
          <Accordion.Item value="requests">
            <Accordion.Control>
              Requests
              {requests.length !== 0 && (
                <Badge
                  color="red"
                  variant="filled"
                  ml={5}
                >
                  {requests.length}
                </Badge>
              )}
            </Accordion.Control>
            <Accordion.Panel>
              <FriendsRequestsList />
            </Accordion.Panel>
          </Accordion.Item>
        )}
        {pending.length > 0 && (
          <Accordion.Item value="pending">
            <Accordion.Control>
              Pending
              {pending.length !== 0 && <Badge ml={5}>{pending.length}</Badge>}
            </Accordion.Control>
            <Accordion.Panel>
              <FriendsPendingList />
            </Accordion.Panel>
          </Accordion.Item>
        )}
      </Accordion>
    </>
  );
};

export default FriendsSideMenuScreen;
