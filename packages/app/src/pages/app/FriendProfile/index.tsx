import {
  Button,
  Container,
  Group,
  Text,
  useMantineTheme
} from "@mantine/core"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import { type Database } from "../../../../types/database.types"
import useHandleFriendsRequests from "../../../Hooks/relationships/useHandleFriendRequests"
import ProfileHeader from "../../../components/ProfileHeader"
import UserAvatar from "../../../components/UserAvatar"
import { getAvatarImage } from "../../../helpers/getAvatarImage"
import useGlobalStore from "../../../store/useGlobalStore"
import useRoomStyles from "../Room/useRoomStyles"
import { showNotification } from "@mantine/notifications"

export default function Profile () {
  const navigate = useNavigate()
  // const isMobile = useMediaQuery("(max-width: 900px)")
  const supabase = useSupabaseClient<Database>()
  const { classes: roomClasses } = useRoomStyles()
  const { user } = useGlobalStore();

  const {
    currentRoom: {
      roomData: {
        // @ts-expect-error
        relationships: [friendship]
      }
    },
    currentRoom: {
      roomData: {
        // @ts-expect-error
        relationships: [{ userData2: friend }]
      }
    }
  } = useGlobalStore()

  const { handleDeleteFriendship } = useHandleFriendsRequests()

  const unfriend = () => {
    handleDeleteFriendship({ friendship })
  }

  const logout = () => {
    supabase.auth.signOut()
    navigate("/login")
  }

  const resetMemories = async () => {
    const userId = user.uid;
    const agentId = friend.id;
    const userIdsArray = `{${userId},${agentId}}`;

    const { msgsError } = await supabase.from("messages").delete().eq("user_ids", userIdsArray);
    if (msgsError) console.error(msgsError);
    
    const { descriptionsError } = await supabase.from("descriptions").delete().eq("user_ids", userIdsArray);
    if (descriptionsError) console.error(descriptionsError);
    
    const { factsError } = await supabase.from("facts").delete().eq("user_ids", userIdsArray);
    if (factsError) console.error(factsError);
    
    const { goalsError } = await supabase.from("goals").delete().eq("user_ids", userIdsArray);
    if (goalsError) console.error(goalsError);

    showNotification({
      title: "Memories reset",
      message: "Memories have been reset successfully",
      color: "green",
    })
  };

  const theme = useMantineTheme()

  return (
    <div>
      <div className={roomClasses.headerContainer}>
        <ProfileHeader title={friend.name} />
      </div>
      <div
        className={roomClasses.messagesContainer}
      >
          <Container maw={"100%"} p={"xxl"} style={{}}>
            <UserAvatar
              src={
                friend?.avatar_url ||
                getAvatarImage(
                  (friend?.name as string) || (friend?.email as string) || ""
                )
              }
              online={true}
              size={"lg"}
            />
            {friend?.is_agent &&
            <Group>
            <Text
              size="sm"
              color={theme.colors.gray[4]}
              mt={"2xl"}
              // mb={"sm"}
              weight={"600"}
              italic={false}
              style={{
                marginLeft: "auto",
                marginRight: "auto"
              }}
            >
              Cojourney Guide
            </Text>
          </Group>
            }
            <>
              <Group>
                <Text>Location: {friend.location || "Not specified"}</Text>
              </Group>
              <Group>
                <Text>Age: {friend.details?.age || "Not specified"}</Text>
              </Group>
              <Group>
                <Text>
                  Pronouns: {friend.details?.pronouns || "Not specified"}
                </Text>
              </Group>
            </>
          </Container>
          {!friend?.is_agent ? (
          <Group
            mb={"lg"}
            mt={"4xl"}
            style={{
              gap: theme.spacing.xs,
            }}
          >
            <Button
              fullWidth
              variant="transparent"
              size="md"
              onClick={unfriend}
            >
              <Text color={theme.white}>Unfriend</Text>
            </Button>
            <Button fullWidth variant="transparent" size="md" onClick={logout}>
              <Text color={theme.colors.red[8]}>Block</Text>
            </Button>
          </Group>
        ) : (
          <Group
            mb={"lg"}
            mt={"4xl"}
            style={{
              gap: theme.spacing.xs,
            }}
          >
            <Button
              fullWidth
              variant="transparent"
              size="md"
              onClick={resetMemories}
            >
              <Text color={theme.colors.red[8]}>Reset Memories</Text>
            </Button>
          </Group>
        )}
      </div>
    </div>
  )
}
