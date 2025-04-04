import { createStyles } from "@mantine/core"

const useRoomStyles = createStyles(() => ({
	layout: {
		display: "flex",
		overflowY: "auto",
		position: "relative",
		paddingBottom: "2.5rem",
		flexDirection: "column",
		width: "100%",
		height: "100%",

		"@media (min-width: 768px)": {
			paddingTop: 0
		}
	},
	header: {
		padding: "1rem",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	headerContainer: {
		position: "relative",
		borderBottom: "0.0625rem solid #2A2A2A"
	}
}))

export default useRoomStyles
