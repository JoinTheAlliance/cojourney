import { createStyles } from "@mantine/core";
import { isSmartphone } from "../../helpers/functions";

const useRootStyles = createStyles((theme) => ({
	container: {
		marginLeft: 400,
		"@media (max-width: 900px)": {
			marginLeft: 0,
		},
	},
	content: {
		height: "100vh",
		backgroundSize: "cover",
		backgroundPosition: "center",
		maxWidth: "calc(100%)",
		paddingTop: 0,
		"@media (max-width: 900px)": {
			marginTop: 60,
			height: isSmartphone ? "calc(100vh - 130px)" : "calc(100vh - 60px)",
		},
		"@media (max-width: 1200px)": {
			maxWidth: "calc(100%)",
		},
	},
	header: {
		position: "fixed",
		top: 0,
		left: 0,
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
