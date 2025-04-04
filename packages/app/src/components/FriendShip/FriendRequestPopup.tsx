import React from "react"
import {
	Avatar,
	Text,
	Button,
	Paper,
	CheckIcon,
	Flex
	// UserPlusIcon
} from "@mantine/core"
import { FaUserPlus } from "react-icons/fa6"
import { IoMdClose } from "react-icons/io"

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
				<Flex gap="md" justify="space-between" align="center">
					<Button
						variant="light"
						color="green"
						leftIcon={
							<FaUserPlus
								style={{
									fontSize: "24px",
									color: "white"
								}}
							/>
						}
					>
						Accept
					</Button>
					<Button
						variant="outline"
						color="red"
						leftIcon={
							<IoMdClose
								style={{
									width: "28.58px",
									height: "32.5px",
									color: "red"
								}}
							/>
						}
					>
						Decline
					</Button>
				</Flex>
			</Flex>
		</Paper>
	)
}

export default ContactPopup
