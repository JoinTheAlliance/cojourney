import { useSupabaseClient } from "@supabase/auth-helpers-react"
import React, { useEffect, useState } from "react"
import { type Database } from "../../../../types/database.types"
import useGetRoomMessages from "../../../Hooks/rooms/useGetRoomMessages"
import useListenToMessagesChanges from "../../../Hooks/rooms/useListenToMessagesChanges"
import useLoadUnreadMessages from "../../../Hooks/rooms/useLoadUnreadMessages"
import useTypingStatus from "../../../Hooks/rooms/useTypingStatus"
import useGlobalStore, {
	type IDatabaseMessage
} from "../../../store/useGlobalStore"
import Messages from "./Messages/Messages"
import MessagesTextInput from "./MessagesTextInput/MessagesTextInput"
import RoomHeader from "./RoomHeader/RoomHeader"
import useRoomStyles from "./useRoomStyles"
import { getAvatarImage } from "../../../helpers/getAvatarImage"

interface Props {
	getRoomData: () => Promise<void>
	roomId: string
}

const Room = ({ roomId, getRoomData }: Props): JSX.Element => {
	const supabase = useSupabaseClient<Database>()
	const { classes } = useRoomStyles()
	const {
		currentRoom: { roomData, isRoomMember }
	} = useGlobalStore()

	const { getRoomMessages } = useGetRoomMessages()
	const { getUnreadMessages } = useLoadUnreadMessages()

	const roomChannel = supabase.channel(roomId)

	useListenToMessagesChanges({ getRoomData })
	useTypingStatus({ roomChannel })

	useEffect(() => {
		if (!roomData?.id) return

		const fetchData = async () => {
			getRoomMessages({ roomId: roomData.id })
			await getUnreadMessages()
		}

		fetchData()
	}, [roomData])

	const [userMessage, setUserMessage] = useState("" as unknown)
	const { currentRoom } = useGlobalStore()

	const friend = currentRoom
	// @ts-expect-error
		? currentRoom?.roomData?.relationships[0]?.userData2
		: null

	return (
		<div
			className={classes.chatLayout}
			style={{
				// eslint-disable-next-line @typescript-eslint/no-unsafe-argument
				backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.9)), url(${
					friend?.avatar_url ||
					getAvatarImage((friend?.name ?? friend?.email ?? "") as string)
				})`
			}}
		>
			<div className={classes.chatContainer}>
				<div className={classes.chat}>
					<div className={classes.headerContainer}>
						<RoomHeader />
					</div>
					<div className={classes.messagesContainer}>
						<Messages userMessage={userMessage as IDatabaseMessage} />
					</div>
					{isRoomMember && (
						<div className={classes.textInputContainer}>
							<MessagesTextInput
								roomChannel={roomChannel}
								onMessageSent={(message) => {
									setUserMessage(message)
								}}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	)
}

export default Room
