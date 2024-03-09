import {
	Button,
	Flex,
	Group,
	Navbar,
	Text,
	rem,
	Box,
	useMantineTheme
} from "@mantine/core"
import React from "react"
import { useNavigate } from "react-router"
import iconImgSrc from "../../../public/icons/account.svg"
import { getAvatarImage } from "../../helpers/getAvatarImage"
import useGlobalStore from "../../store/useGlobalStore"
import UserAvatar from "../UserAvatar"
import useSideMenuStyles from "./SideMenu.styles"
import FriendsSideMenuScreen from "./SideMenuScreens/FriendsSideMenuScreen"

const SideMenu = ({ closeMenu }: { closeMenu: () => void }): JSX.Element => {
	const { classes } = useSideMenuStyles()
	const theme = useMantineTheme()
	const navigate = useNavigate()
	const { user } = useGlobalStore()

	return (
		<Navbar className={classes.container}>
			<Navbar.Section className={classes.wrapper} grow>
				<div className={classes.main}>
					<Text
						p={"lg"}
						size={"xl"}
						weight={700}
						mb={6}
						color={theme.colors.gray[0]}
						style={{
							textShadow: "0 0 10px #00000045",
							lineHeight: "initial"
						}}
					>
						COJOURNEY
					</Text>

					<Flex direction={"column"} justify={"space-between"}>
						<FriendsSideMenuScreen />
						<Flex
							pos={"absolute"}
							bottom={"0"}
							w={"100%"}
							p={"xl"}
							direction={"row"}
							gap={"xl"}
							align={"center"}
							justify="space-between"
							style={{
								borderTop: "0.0625rem solid #2A2A2A"
							}}
						>
							<Group>
								<UserAvatar
									src={
										user.avatar_url ||
										getAvatarImage(user.name || user.email || "")
									}
									online={true}
								/>
								<Box w={96.5}>
									<Text color={theme.white} weight={500} truncate="end">
										{user.name}
									</Text>
									<Text size="xs" color="dimmed">
										Online
									</Text>
								</Box>
							</Group>
							<Group
								style={{
									textAlign: "center"
								}}
							>
								<Button
									size={"sm"}
									bg={"#292929"}
									style={{
										display: "flex",
										alignItems: "center",
										backgroundColor: "#292929",
										paddingLeft: rem(20),
										color: "#757474"
									}}
									onClick={() => {
										navigate("/profile")
										closeMenu()
									}}
								>
									<Text mr={"md"}>My Account</Text>
									<img
										src={iconImgSrc}
										alt="Icon"
										width={"20px"}
										height={"20px"}
									/>
								</Button>
							</Group>
						</Flex>
					</Flex>
				</div>
			</Navbar.Section>
		</Navbar>
	)
}

export default SideMenu
