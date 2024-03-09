import React from "react"
import { Flex, Text, useMantineTheme } from "@mantine/core"
import useSideMenuStyles from "./LayoutStyles"
import iconImgSrc from "../../../../public/icons/arrow_left.svg"
import { useMediaQuery } from "@mantine/hooks"
import { useNavigate } from "react-router-dom" // Import the hook

function index ({
	children,
	title
}: {
	children: React.ReactNode
	title: string
}) {
	const { classes } = useSideMenuStyles()
	const theme = useMantineTheme()
	const isMobile = useMediaQuery("(max-width: 900px)")
	const nav = useNavigate()
	return (
		<div className={classes.layout}>
			<Flex
				style={{ padding: "0 1rem" }}
				className={classes.headerContainer}
				justify={isMobile ? "space-between" : "center"}
				align="center"
			>
				{isMobile && (
					<div
						onClick={() => {
							nav(-1)
						}}
					>
						<img
							src={iconImgSrc}
							alt="Icon"
							width={"20px"}
							height={"20px"}
							style={{ cursor: "pointer" }}
						/>
					</div>
				)}
				<div className={classes.header}>
					<Text weight={700} size={""} color={theme.white}>
						{title}
					</Text>
				</div>
				<div></div>
			</Flex>
			<div>{children}</div>
		</div>
	)
}

export default index
