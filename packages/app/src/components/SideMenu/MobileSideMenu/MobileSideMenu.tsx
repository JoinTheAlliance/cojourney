import React from "react"
import { useNavigate } from "react-router"
import {
	Drawer,
	Button,
	Flex,
	Navbar,
	Text,
	Box,
	useMantineTheme
} from "@mantine/core" // Import Drawer from Mantine
import iconImgSrc from "../../../../public/icons/account.svg"
import { getAvatarImage } from "../../../helpers/getAvatarImage"
import useGlobalStore from "../../../store/useGlobalStore"
import UserAvatar from "../../UserAvatar"
import useSideMenuStyles from "./MobileSideMenustyles"
import FriendsSideMenuScreen from "../SideMenuScreens/FriendsSideMenuScreen"
import menuImgSrc from "../../../../public/icons/menu.svg"

const MobileSideMenu = (): JSX.Element => {
	const { classes } = useSideMenuStyles()
	const navigate = useNavigate()
	const { app, setApp, user } = useGlobalStore()
	const theme = useMantineTheme()
	const closeMenu = () => {
		setApp({ isMobileMenuOpen: false })
	}
	return (
		<>
			<img
				src={menuImgSrc}
				alt="Icon"
				width={"20px"}
				height={"20px"}
				style={{ cursor: "pointer" }}
				onClick={() => {
					setApp({ isMobileMenuOpen: !app.isMobileMenuOpen })
				}}
			/>
			<Drawer
				onClose={() => {
					setApp({ isMobileMenuOpen: false })
				}}
				opened={app.isMobileMenuOpen}
				overlayProps={{ blur: 5 }}
				position="right"
				withCloseButton
				zIndex={1000}
				styles={{
					header: {
						backgroundColor: "transparent"
					},
					body: {
						padding: "0 !important"
					},
					content: {
						backgroundColor: "#141414"
					}
				}}
			>
				<Navbar className={classes.container}>
					<Navbar.Section className={classes.wrapper} grow>
						<div className={classes.main}>
							<Flex direction={"column"}>
								<Flex
									w={"100%"}
									p={"xl"}
									direction={"row"}
									gap={"xl"}
									align={"center"}
									justify="space-between"
								>
									<Flex align={"center"} gap={5}>
										<UserAvatar
											src={
												user.avatar_url ||
												getAvatarImage(user.name || user.email || "")
											}
											online={true}
										/>
										<Box w={96.5}>
											<Text color={theme.white} weight={300} truncate="end">
												{user.name}
											</Text>
											<Text size="xs" color="dimmed">
												Online
											</Text>
										</Box>
									</Flex>

									<Button
										bg={"#292929"}
										style={{
											backgroundColor: "#292929",
											color: "#757474",
											width: "100%"
										}}
										onClick={() => {
											navigate("/profile")
											closeMenu()
										}}
										rightIcon={
											<img
												src={iconImgSrc}
												alt="Icon"
												width={"15px"}
												height={"15px"}
											/>
										}
									>
										My Account
									</Button>
								</Flex>
								<Flex
									direction={"column"}
									justify={"space-between"}
									style={{
										flex: "1 1 0%",
										overflowY: "auto"
									}}
								>
									<FriendsSideMenuScreen />
								</Flex>
							</Flex>
						</div>
					</Navbar.Section>
				</Navbar>
			</Drawer>
		</>
	)
}

export default MobileSideMenu
