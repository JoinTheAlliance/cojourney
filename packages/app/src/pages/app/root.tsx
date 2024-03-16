import { useMediaQuery } from "@mantine/hooks"
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import React, { useEffect } from "react"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { type Database } from "../../../types/database.types"
import useListenToFriendshipChanges from "../../Hooks/relationships/useListenToFrienshipChanges"
import useListenToRoomChanges from "../../Hooks/rooms/useListenToRoomChanges"
import useListenToUnreadMessagesChanges from "../../Hooks/rooms/useListenToUnreadMessages"
import useLoadUnreadMessages from "../../Hooks/rooms/useLoadUnreadMessages"
import useLoadUserData from "../../Hooks/useLoadUserData"
import SideMenu from "../../components/SideMenu/SideMenu"
import { isSmartphone } from "../../helpers/functions"
import removeTypingIndicatorFromOfflineUsers from "../../helpers/removeTypingIndicatorFromOfflineUsers"
import useGlobalStore, { initialState } from "../../store/useGlobalStore"
import OAuthUser from "./../../components/OAuthUser"
import useRootStyles from "./useRootStyles"
import FriendRequestPopup from "../../components/FriendShip/FriendRequestPopup"

const Root = (): JSX.Element => {
	const { getUserFriends, getUserRoomData } = useLoadUserData()
	useListenToFriendshipChanges({ getUserFriends, getUserRoomData })
	useListenToRoomChanges({ getUserRoomData })
	useListenToUnreadMessagesChanges()

	const { getUnreadMessages } = useLoadUnreadMessages()

	const { classes } = useRootStyles()
	const location = useLocation()

	const isMobile = useMediaQuery("(max-width: 900px)")
	const session = useSession()
	const supabase = useSupabaseClient<Database>()
	const {
		setApp,
		currentRoom: { usersTyping },
		setCurrentRoom,
		dms
	} = useGlobalStore()
	const navigate = useNavigate()

	useEffect(() => {
		if (
			(location.pathname === "/" || location.pathname === "/#") &&
			dms.length > 0
		) {
			navigate(`/chat/${dms[0].id}`)
		}
	}, [location.pathname, dms])

	useEffect(() => {
		if (!session) return
		if (!location) return

		if (location.pathname === "/" || location.pathname === "/#") {
			setCurrentRoom(initialState.currentRoom)
			setApp({
				secondaryActiveSideMenu: null,
				messageAccordionSelected: null
			})
		}
	}, [location, session])

	useEffect(() => {
		if (!session) return
		;(async () => {
			getUnreadMessages()
		})()
	}, [session])

	useEffect(() => {
		if (!session) return
		const channel = supabase.channel("online-accounts", {
			config: {
				presence: {
					key: session.user.email
				}
			}
		})

		channel
			.subscribe(async (status) => {
				if (status === "SUBSCRIBED") {
					const presenceTrackStatus = await channel.track({
						user: session.user.email,
						online_at: new Date().toISOString()
					})

					if (presenceTrackStatus === "ok") {
						await channel.untrack()
					}
				}
			})
			.on("presence", { event: "sync" }, () => {
				const state = channel.presenceState()

				removeTypingIndicatorFromOfflineUsers({
					usersTyping,
					setCurrentRoom,
					onlineUsers: state
				})

				setApp({
					onlineUsers: state
				})
			})

		// eslint-disable-next-line consistent-return
		return () => {
			channel.unsubscribe()
		}
	}, [session])

	if (!session) {
		return <OAuthUser />
	}

	// const hasMoreThanOneFriend = friends.length > 0 || requests.length > 0 || pending.length > 0;
	return (
		<div
			className={classes.container}
			style={{
				marginTop: isSmartphone ? "8rem" : "0"
			}}
		>
			{!isMobile && <SideMenu closeMenu={(): void => {}} />}
			<div className={classes.content}>
				<FriendRequestPopup />
				<Outlet />
			</div>
		</div>
	)
}

export default Root
