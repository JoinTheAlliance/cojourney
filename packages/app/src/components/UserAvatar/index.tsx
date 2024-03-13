import { Avatar, Group } from "@mantine/core"
import React from "react"

const UserAvatar = ({
	src,
	online,
	size = "sm",
	handleOnClick
}: {
	src: string
	online: boolean
	size?: string
	handleOnClick?: () => void
}) => {
	return (
		<>
			{size === "lg" ? (
				<Group position="center">
					<div style={{ position: "relative" }}>
						<Avatar
							src={src}
							radius="50%"
							style={{
								width: "10rem",
								height: "10rem"
							}}
							onClick={handleOnClick}
						/>
						<div
							style={{
								width: "30px",
								height: "30px",
								borderRadius: "50%",
								backgroundColor: online ? "green" : "gray",
								position: "absolute",
								right: "0",
								bottom: "0",
								border: "2px solid white",
								transform: "translate(-25%, -25%)"
							}}
						/>
					</div>
				</Group>
			) : (
				<Group position="center">
					<div style={{ position: "relative" }}>
						<Avatar src={src} size="md" radius="50%" onClick={handleOnClick} />
						<div
							style={{
								width: "10px",
								height: "10px",
								borderRadius: "50%",
								backgroundColor: online ? "green" : "gray",
								position: "absolute",
								right: "0",
								bottom: "0",
								border: "1px solid white",
								transform: "translate(20%, 0%)"
							}}
						/>
					</div>
				</Group>
			)}
		</>
	)
}

export default UserAvatar
