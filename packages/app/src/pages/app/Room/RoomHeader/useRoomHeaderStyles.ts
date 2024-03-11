import { createStyles } from "@mantine/core"

const useRoomHeaderStyles = createStyles((_theme) => ({
	container: {
		padding: "1rem"
	},

	headerLeft: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between"
	},

	participants: {
		cursor: "pointer"
	}
}))

export default useRoomHeaderStyles
