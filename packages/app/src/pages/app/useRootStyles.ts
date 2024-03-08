import { createStyles } from "@mantine/core";
import { isSmartphone } from "../../helpers/functions";

const useRootStyles = createStyles((theme) => ({
	container: {
		height: "100vh",
		position: "relative",
		display: "flex",
		flexDirection: "row",
		"@media (max-width: 900px)": {
			flexDirection: "column",
		},
	},
	content: {
		height: "100%",
		width: "100%",
		backgroundSize: "cover",
		backgroundPosition: "center",
		paddingTop: 0,
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
		}`,
	},
}));

export default useRootStyles;
