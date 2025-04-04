import { createStyles } from "@mantine/core"

const useRootStyles = createStyles((theme) => ({
	container: {
		height: "100dvh",
		width: "100%",
		position: "relative",
		display: "flex",
		flexDirection: "row",
		overflow: "hidden",
		"@media (max-width: 900px)": {
			flexDirection: "column"
		}
	},
	content: {
		display: "flex",
		overflow: "hidden",
		position: "relative",
		flexDirection: "column",
		flex: "1 1 0%",
		maxWidth: "100%",
		height: "100%"
	},
	sidebar: {
		flexShrink: 0,
		width: "380px"
	},
	header: {
		width: "100vw",
		padding: 15,
		display: "flex",
		justifyContent: "space-between",
		backgroundColor:
			theme.colorScheme === "dark"
				? theme.colors.dark[9]
				: theme.colors.gray[1],

		borderBottom: `1px solid ${
			theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[3]
		}`
	}
}))

export default useRootStyles
