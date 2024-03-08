import React from "react";
import useSideMenuStyles from "./LayoutStyles";

function index({ children }: { children: React.ReactNode }) {
	const { classes } = useSideMenuStyles();
	return <div className={classes.layout}>{children}</div>;
}

export default index;
