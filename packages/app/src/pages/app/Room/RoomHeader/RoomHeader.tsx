import { Flex, Group, Tooltip, Text, useMantineTheme } from "@mantine/core"
import React from "react"
import { useNavigate } from "react-router-dom"
import UserAvatarWithIndicator from "../../../../components/UserAvatarWithIndicator/UserAvatarWithIndicator"
import useGlobalStore from "../../../../store/useGlobalStore"
import useRoomHeaderStyles from "./useRoomHeaderStyles"
import { getAvatarImage } from "../../../../helpers/getAvatarImage"
import MobileSideMenu from "../../../../components/SideMenu/MobileSideMenu/MobileSideMenu"
import { useMediaQuery } from "@mantine/hooks"
import iconImgSrc from "../../../../../public/icons/arrow_left.svg"

const RoomHeader = (): JSX.Element => {
	const { classes } = useRoomHeaderStyles()
	const { currentRoom } = useGlobalStore()

	// @ts-nocheck
	const friend = currentRoom
		? currentRoom?.roomData?.relationships[0]?.userData2
		: null
	const navigate = useNavigate()

	if (!friend) {
		return <p>Error</p>
	}
	const theme = useMantineTheme()

	const goToProfile = () => {
		navigate("/friend")
	}
	const isMobile = useMediaQuery("(max-width: 900px)")
	const nav = useNavigate()

	return (
		<div>
			<div className={classes.container}>
				<div className={classes.headerLeft}>
					<div>
						{isMobile && (
							<div
								onClick={() => {
									nav(-1)
								}}
							>
								<img
									src={iconImgSrc}
									alt="Icon"
									width={"20px"}
									height={"20px"}
									style={{ cursor: "pointer" }}
								/>
							</div>
						)}
					</div>
					<div className={classes.participants}>
						<Group noWrap onClick={goToProfile}>
							<Tooltip key={friend.id} label={friend.name} withArrow>
								<div>
									<UserAvatarWithIndicator
										image={
											friend?.avatar_url ||
											getAvatarImage(
												(friend.name as string) ||
													(friend.email as string) ||
													"/background.png"
											)
										}
										size={40}
										user_email={friend.email}
									/>
								</div>
							</Tooltip>
							<Group display={"block"}>
								<Flex align={"baseline"}>
									<Text color={theme.white} weight={500}>
										{friend.name}
									</Text>
								</Flex>
								<Text size="xs" color="dimmed">
									{"Online"}
								</Text>
							</Group>
						</Group>
					</div>
					<div>
						{isMobile && (
							<>
								<MobileSideMenu />
							</>
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default RoomHeader
