import { createStyles } from "@mantine/core";

const useRoomStyles = createStyles((theme) => ({
	layout: {
		display: "flex",
		overflowY: "auto",
		position: "relative",
		paddingBottom: "2.5rem",
		flexDirection: "column",
		width: "100%",
		height: "100%",

		"@media (min-width: 768px)": {
			paddingTop: 0,
		},
		"@media (min-width: 1024px)": {
			paddingLeft: "380px",
		},
	},
}));

export default useRoomStyles;
