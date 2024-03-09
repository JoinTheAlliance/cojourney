import { createStyles } from "@mantine/core"

const useProfileStyles = createStyles(() => ({
	container: {
		padding: 8,
		position: "relative",
		overflow: "auto",
		width: "100%",
		height:
			"calc(100vh - var(--mantine-header-height, 0rem) - var(--mantine-footer-height, 0rem))"
	},
	titleContainer: {
		flexGrow: 1
	},
	content: {
		height: "100%"
	},
	select: {
		border: "none",
		backgroundColor: "#232627",
		padding: "1em 1em",
		display: "block",
		width: "100%",
		borderRadius: "10px",
		// hide the arrow
		WebkitAppearance: "none"
	},
	input: {
		padding: "1.5rem",
		border: "1px solid #232627",
		borderRadius: "0.8rem",
		background: "transparent"
	},
	logoutButton: {
		color: "#f00",
		cursor: "pointer",
		textAlign: "center"
	},
	profile_container: {
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

		"@media (min-width: 768px)": {
			paddingLeft: "1.25rem",
			paddingRight: "1.25rem",
			paddingTop: "2.5rem"
		}
	},
	headerContainer: {
		position: "relative",
		borderBottom: "0.0625rem solid #2A2A2A"
	}
}))

export default useProfileStyles
