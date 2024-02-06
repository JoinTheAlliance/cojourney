import React from "react";
import { Badge, Button, Flex, Loader, Menu, Text, Title } from "@mantine/core";
import { MessageSquare, UserPlus, X } from "react-feather";
import { openConfirmModal } from "@mantine/modals";
import { useNavigate } from "react-router-dom";
import FriendsConditionalRendering from "../Friends/FriendsConditionalRendering/FriendsConditionalrendering";
import UserAvatarWithIndicator from "../UserAvatarWithIndicator/UserAvatarWithIndicator";
import useHandleFriendsRequests from "../../Hooks/relationships/useHandleFriendRequests";
import useGlobalStore from "../../store/useGlobalStore";

interface Props {
  children: JSX.Element;
  user: {
    email: string;
    id: string;
    imageUrl: string;
    name: string;
  };
}

const UserPopup = ({ user, children }: Props): JSX.Element => {
  const {
    relationships: { friends },
    setApp,
    user: { uid },
  } = useGlobalStore();

  const navigate = useNavigate();

  const { isLoading, handleSendFriendRequest, handleDeleteFriendship } =
    useHandleFriendsRequests();

  return (
    <div onClick={() => {
      const friendship = friends.find((friend) => {
        return friend.user_a === uid || friend.user_b === uid;
      });

      setApp({
        secondaryActiveSideMenu: friendship?.room_id,
      });

      navigate(`/chat/${friendship?.room_id}`);
    }}
    >
    {children}
    </div>
    // <Menu
    //   shadow="lg"
    //   width="xl"
    //   position="bottom-start"
    //   withArrow
    //   withinPortal
    // >
    //   <Menu.Target>
    //     <div style={{ cursor: "pointer" }}>{children}</div>
    //   </Menu.Target>

    //   <Menu.Dropdown
    //     p={20}
    //     ml={10}
    //     style={{ maxWidth: 250 }}
    //   >
    //     <Flex
    //       p={20}
    //       justify="center"
    //       direction="column"
    //       align="center"
    //     >
    //       <UserAvatarWithIndicator
    //         image={user.imageUrl}
    //         size={100}
    //         user_email={user.email}
    //         checkOnline
    //       />
    //       <Title
    //         mt={15}
    //         size={20}
    //         lineClamp={1}
    //       >
    //         {user.id === uid ? `You (${user.name})` : user.name}
    //       </Title>
    //       <Text
    //         size="sm"
    //         lineClamp={1}
    //         style={{ maxWidth: "100%" }}
    //       >
    //         {user.email}
    //       </Text>
    //     </Flex>

    //     <Flex
    //       direction="column"
    //       justify="center"
    //       align="center"
    //     >
    //       <FriendsConditionalRendering
    //         userId={user.id}
    //         renderIf="FRIENDS"
    //       >
    //         <>
    //           <Badge mb={20}>You are friends</Badge>
    //           <Button
    //             loading={isLoading}
    //             fullWidth
    //             leftSection={<MessageSquare size="sm" />}
    //             onClick={() => {
    //               const friendship = friends.find((friend) => {
    //                 return friend.user_a === uid || friend.user_b === uid;
    //               });

    //               setApp({
    //                 secondaryActiveSideMenu: friendship?.room_id,
    //               });

    //               navigate(`/chat/${friendship?.room_id}`);
    //             }}
    //           >
    //             {`Message ${user.name}`}
    //           </Button>
    //           <Button
    //             mt={10}
    //             loading={isLoading}
    //             fullWidth
    //             color="red"
    //             variant="light"
    //             leftSection={<X size="sm" />}
    //             onClick={() => {
    //               const friendship = friends.find((friend) => {
    //                 return friend.user_a === uid || friend.user_b === uid;
    //               });

    //               if (friendship) {
    //                 openConfirmModal({
    //                   zIndex: 1001,
    //                   overlayProps: {
    //                     blur: 5,
    //                   },
    //                   labels: {
    //                     confirm: "Yes, delete the mofo",
    //                     cancel: "No, I like them",
    //                   },
    //                   title: "Are you sure you want to remove this friend?",
    //                   onConfirm: () => {
    //                     handleDeleteFriendship({
    //                       friendship,
    //                     });
    //                   },
    //                 });
    //               }
    //             }}
    //           >
    //             Remove from friends
    //           </Button>
    //         </>
    //       </FriendsConditionalRendering>
    //       <FriendsConditionalRendering
    //         renderIf="PENDING"
    //         userId={user.id}
    //       >
    //         <Badge>Request pending</Badge>
    //       </FriendsConditionalRendering>
    //       <FriendsConditionalRendering
    //         renderIf="REQUEST"
    //         userId={user.id}
    //       >
    //         <Badge color="red">Sent you a request</Badge>
    //       </FriendsConditionalRendering>
    //     </Flex>

    //     <FriendsConditionalRendering
    //       renderIf="NOT_FRIENDS"
    //       userId={user.id}
    //     >
    //       <Menu.Item
    //         closeMenuOnClick={false}
    //         onClick={() => {
    //           handleSendFriendRequest({
    //             friendEmail: user.email,
    //             friendId: user.id,
    //           });
    //         }}
    //         icon={isLoading ? <Loader size={16} /> : <UserPlus size={16} />}
    //       >
    //         Send friend request
    //       </Menu.Item>
    //     </FriendsConditionalRendering>
    //   </Menu.Dropdown>
    // </Menu>
  );
};

export default UserPopup;
