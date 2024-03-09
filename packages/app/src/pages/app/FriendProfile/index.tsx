import { Button, Container, Group, Text, useMantineTheme } from "@mantine/core"
import { showNotification } from "@mantine/notifications"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import React from "react"
import { useNavigate } from "react-router-dom"
import { type JSX } from "react/jsx-runtime"
import { type Database } from "../../../../types/database.types"
import useHandleFriendsRequests from "../../../Hooks/relationships/useHandleFriendRequests"
import UserAvatar from "../../../components/UserAvatar"
import { getAvatarImage } from "../../../helpers/getAvatarImage"
import useGlobalStore from "../../../store/useGlobalStore"
import MainLayout from "../MainLayout.tsx"
import useRoomStyles from "../Room/useRoomStyles"

export default function Profile (): JSX.Element {
  const navigate = useNavigate()
  // const isMobile = useMediaQuery("(max-width: 900px)")
  const supabase = useSupabaseClient<Database>()
  const { classes: roomClasses } = useRoomStyles()
  const { user } = useGlobalStore()
  const session = useSession()

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

  const theme = useMantineTheme()
  const resetMemories = async () => {
    const userId = user.uid
    const agentId = friend.id
    const userIdsArray = `{${userId},${agentId}}`

    const { error: msgsError } = await supabase.from("messages").delete().eq("user_ids", userIdsArray)
    if (msgsError) console.error(msgsError)

	const { error: memoriesError } = await supabase.from("memories").delete().eq("user_ids", userIdsArray)
	if (memoriesError) console.error(memoriesError)

    const { error: descriptionsError } = await supabase.from("descriptions").delete().eq("user_ids", userIdsArray)
    if (descriptionsError) console.error(descriptionsError)

	const { error: memoriesError2 } = await supabase.from("memories").delete().eq("user_id", userId)
	if (memoriesError2) console.error(memoriesError2)

    const { error: factsError } = await supabase.from("facts").delete().eq("user_ids", userIdsArray)
    if (factsError) console.error(factsError)

    const { error: goalsError } = await supabase.from("goals").delete().eq("user_ids", userIdsArray)
	if (goalsError) console.error(goalsError)
	// delete all goals where user_id is the current user
	const { error: goalsError2 } = await supabase.from("goals").delete().eq("user_id", userId)
	if (goalsError2) console.error(goalsError2)

	const serverUrl = import.meta?.env?.REACT_APP_SERVER_URL || import.meta?.env?.VITE_SERVER_URL || "https://cojourney.shawmakesmagic.workers.dev/"

	await fetch((serverUrl + "api/agents/newuser") as string, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: "Bearer " + session?.access_token
		},
		body: JSON.stringify({
		user_id: userId,
		token: session?.access_token
		})
	})

    showNotification({
      title: "Memories reset",
      message: "Memories have been reset successfully",
      color: "green"
    })
  }

	return (
		<MainLayout title={friend.name}>
      <div className={roomClasses.messagesContainer}>
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
					{friend?.is_agent && (
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
					)}
					{!friend?.is_agent && (
						<>
							<Group>
								<Text>Location: {friend.location || "Not specified"}</Text>
							</Group>
							<Group>
								<Text>Age: {friend.age || "Not specified"}</Text>
							</Group>
							<Group>
								<Text>Pronouns: {friend.pronouns || "Not specified"}</Text>
							</Group>
						</>
					)}
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
							gap: theme.spacing.xs
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
              gap: theme.spacing.xs
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
		</MainLayout>
	)
}
