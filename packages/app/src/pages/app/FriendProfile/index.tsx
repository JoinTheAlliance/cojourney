import { Button, Container, Group, Text, useMantineTheme } from "@mantine/core";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React from "react";
import { useNavigate } from "react-router-dom";
import { type Database } from "../../../../types/database.types";
import useHandleFriendsRequests from "../../../Hooks/relationships/useHandleFriendRequests";
import UserAvatar from "../../../components/UserAvatar";
import { getAvatarImage } from "../../../helpers/getAvatarImage";
import useGlobalStore from "../../../store/useGlobalStore";
import useRoomStyles from "../Room/useRoomStyles";
import MainLayout from "../MainLayout.tsx";

export default function Profile() {
	const navigate = useNavigate();
	// const isMobile = useMediaQuery("(max-width: 900px)")
	const supabase = useSupabaseClient<Database>();
	const { classes: roomClasses } = useRoomStyles();

	const {
		currentRoom: {
			roomData: {
				// @ts-expect-error
				relationships: [friendship],
			},
		},
		currentRoom: {
			roomData: {
				// @ts-expect-error
				relationships: [{ userData2: friend }],
			},
		},
	} = useGlobalStore();

	const { handleDeleteFriendship } = useHandleFriendsRequests();

	const unfriend = () => {
		handleDeleteFriendship({ friendship });
	};

	const logout = () => {
		supabase.auth.signOut();
		navigate("/login");
	};

	const theme = useMantineTheme();

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
									marginRight: "auto",
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
				{!friend?.is_agent && (
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
				)}
			</div>
		</MainLayout>
	);
}
