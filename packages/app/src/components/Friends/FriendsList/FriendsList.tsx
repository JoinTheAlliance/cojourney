import { Flex, Text, Title, useMantineTheme, useMantineColorScheme } from "@mantine/core";
import React from "react";
import UserAvatarWithIndicator from "../../UserAvatarWithIndicator/UserAvatarWithIndicator";
import getFriend from "../../../utils/getFriend";
import UserPopup from "../../UserPopup/UserPopup";

const FriendsList = ({ friends, user }: { friends: any, user: any}): JSX.Element => {
  const theme = useMantineTheme();
  const colorScheme = useMantineColorScheme();
  if (friends.length === 0) {
    return (
      <p>No friends yet!</p>
    );
  }

  return (
    <div>
      {friends.map((friendship: any) => {
        const { friendData } = getFriend({
          friendship,
          userId: user.uid || "",
        });

        if (!friendData) return null;

        return (
          <UserPopup
            user={{
              email: friendData.email || "",
              imageUrl: friendData.avatar_url || "",
              name: friendData.name || "",
              id: friendData.id || "",
            }}
            key={friendship.id}
          >
            <Flex
              style={{
                padding: 5,
                borderRadius: 5,
                cursor: "pointer",
                ":hover": {
                  backgroundColor:
                    colorScheme.colorScheme === "dark"
                      ? theme.colors.dark[6]
                      : theme.colors.gray[1],
                },
              }}
              key={friendship.id}
              align="center"
              mt={10}
            >
              <UserAvatarWithIndicator
                // @ts-ignore
                image={friendData.avatar_url}
                size={40}
                // @ts-ignore
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
                    {/* @ts-ignore */}
                    {friendData.name}
                  </Title>
                </Flex>
                <Text
                  lineClamp={1}
                  c="dimmed"
                  size="sm"
                >
                  {/* @ts-ignore */}
                  {friendData.email}
                </Text>
              </div>
            </Flex>
          </UserPopup>
        );
      })}
    </div>
  );
};

export default FriendsList;
