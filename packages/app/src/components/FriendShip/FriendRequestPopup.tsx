import React from "react"
import {
	Avatar,
	Text,
	Button,
	Paper,
	CheckIcon,
	Flex
	// PhoneIcon,
	// UserPlusIcon
} from "@mantine/core"

const ContactPopup = () => {
	return (
		<Paper
			shadow="xs"
			p="xl"
			style={{
				position: "absolute",
				bottom: "7rem",
				left: "0",
				right: "0",
				borderRadius: "25.15px",
				backgroundColor: "rgba(114, 114, 114, 0.5)",
				backdropFilter: "blur(10px)",
				zIndex: "999"
			}}
		>
			<Text className="mb-2 md:mb-0 lg:mb-0 text-[#444444]">
				Emmy wants you to meet
			</Text>
			<Flex gap="md" justify="space-between" align="center">
				<div className="flex items-center justify-center mr-2">
					<Avatar
						src="/images/characters/upstreet/2d/anemone.png"
						sizes="lg"
						style={{ borderRadius: "1000px" }}
					/>
					<Text className="ml-2 lg:ml-4 mb-1.5 font-bold font-sans w-[100px] lg:w-[200px] text-left overflow-hidden whitespace-nowrap overflow-ellipsis">
						Moon
					</Text>
				</div>
				<div className="flex items-center justify-center gap-2 lg:gap-4 place-items-baseline">
					<Button
						variant="outline"
						color="blue"
						style={{
							transform: "scale(1)",
							transition: "transform 500ms",
							":hover": { transform: "scale(1.1)" }
						}}
					>
						<CheckIcon
							style={{ width: "28.58px", height: "32.5px", color: "white" }}
						/>
					</Button>
					<Button
						variant="outline"
						color="blue"
						style={{
							transform: "scale(1)",
							transition: "transform 500ms",
							":hover": { transform: "scale(1.1)" }
						}}
					>
						{/* <UserPlusIcon style={{ fontSize: "24px", color: "white" }} /> */}
					</Button>
					<Button
						variant="outline"
						color="red"
						style={{
							transform: "scale(1)",
							transition: "transform 500ms",
							":hover": { transform: "scale(1.1)" }
						}}
					>
						<img
							src="/icons/Close.svg"
							alt="close"
							style={{ width: "23.5px", height: "20px" }}
						/>
					</Button>
				</div>
			</Flex>
		</Paper>
	)
}

export default ContactPopup
