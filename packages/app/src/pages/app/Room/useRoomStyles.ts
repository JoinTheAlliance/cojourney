import { createStyles } from "@mantine/core"

const useRoomStyles = createStyles((theme) => ({
	headerContainer: {
		position: "relative",
		borderBottom: "0.0625rem solid #2A2A2A"
	},
	messagesContainer: {
		display: "flex",
		paddingLeft: "0.75rem",
		paddingRight: "0.75rem",
		paddingTop: "1.25rem",
		paddingBottom: "1.25rem",
		flexDirection: "column",
		flexGrow: 1,
		width: "100%",
		maxWidth: "100%",
		height: "0",
		overflowY: "auto",

		"@media (min-width: 768px)": {
			paddingLeft: "1.25rem",
			paddingRight: "1.25rem",
			paddingTop: "2.5rem"
		},
		"@media (min-width: 1024px)": {
			maxWidth: "80rem"
		}
	},
	textInputContainer: {
		padding: "1rem",
		width: "100%"
	},
	desktopSideMenu: {
		position: "fixed",
		right: 0,
		top: 0,
		width: 400,
		borderLeft: `1px solid ${
			theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
		}`,
		backgroundColor:
			theme.colorScheme === "dark"
				? theme.colors.dark[8]
				: theme.colors.gray[0],
		height: "100%",
		padding: 20,
		"@media (max-width: 1200px)": {
			display: "none"
		}
	},
	join_room_container: {
		position: "absolute",
		zIndex: 100,
		width: "100%",
		left: 0,
		top: 0
	},
	chatLayout: {
		boxSizing: "border-box",
		display: "flex",
		overflow: "auto",
		position: "relative",
		flexDirection: "column",
		width: "100%",
		maxWidth: "100%",
		height: "100%",
		backgroundSize: "cover",
		backgroundPosition: "center",
		flex: "1 1 0%"
	},
	chatContainer: {
		display: "flex",
		overflow: "hidden",
		flexDirection: "row",
		width: "100%",
		height: "100%",
		flexGrow: 1,
		marginLeft: "auto",
		marginRight: "auto",
		"@media (min-width: 768px)": {
			paddingTop: 0
		}
		// "@media (min-width: 1024px)": {
		// 	paddingLeft: "380px"
		// }
	},
	chat: {
		display: "flex",
		overflow: "hidden",
		position: "relative",
		flexBasis: "100%",
		flexGrow: 1,
		flexDirection: "column",
		width: "100%",
		height: "100%",

		"@media (min-width: 1024px)": {
			paddingLeft: 0,
			paddingRight: 0
		}
	},
	room_loader: {
		marginLeft: "20px",
		marginRight: "auto"
		// "@media (min-width: 1024px)": {
		// 	paddingLeft: "380px"
		// }
	}
}))

export default useRoomStyles
