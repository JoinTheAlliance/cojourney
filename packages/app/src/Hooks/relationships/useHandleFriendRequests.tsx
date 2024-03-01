import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useState } from "react"
import { showNotification } from "@mantine/notifications"
import { type Database } from "../../../types/database.types"
import useGlobalStore, {
  type IDatabaseUser,
  type IFriend
} from "../../store/useGlobalStore"
import { useNavigate } from "react-router"
import useLoadUserData from "../useLoadUserData"

interface IAcceptFriendRequest {
  friendData: IDatabaseUser
  friendship: IFriend
}

interface IRejectFriendRequest {
  friendship: IFriend
}

interface ISendFriendRequest {
  friendEmail: string
  friendId: string
}

const useHandleFriendsRequests = () => {
  const supabase = useSupabaseClient<Database>()
  const { user } = useGlobalStore()

  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const { getUserFriends } = useLoadUserData()
  const session = useSession()

  const handleMakeFriend = async ({
    friendId
  }: ISendFriendRequest): Promise<void> => {
    setIsLoading(true)

    if (!user) return
    if (!user.uid) return

    const { data: newRoom } = await supabase.from("rooms").insert({
      created_by: user.uid,
      name: "Default Friend Room"
    }).select().single()

    await supabase.from("participants").insert({
      user_id: user.uid,
      // @ts-expect-error
      room_id: newRoom.id
    })

    await supabase.from("participants").insert({
      user_id: friendId,
      // @ts-expect-error
      room_id: newRoom.id
    })

    const { data, error } = await supabase.from("relationships").insert({
      status: "FRIENDS",
      user_a: user.uid,
      user_b: friendId,
      user_id: user.uid,
      room_id: newRoom?.id
    }).select().single()

    if (error) {
      setIsLoading(false)
      showNotification({
        title: "Error",
        message: error.message,
        color: "red"
      })

      return
    }

    // @ts-expect-error
    await getUserFriends(session)
    showNotification({
      title: "Friend added successfully",
      message: "Now, its time to chat."
    })
    setIsLoading(false)

    navigate(`/chat/${newRoom?.id}`)
    // @ts-expect-error
    return data
  }

  const handleSendFriendRequest = async ({
    friendId
  }: ISendFriendRequest): Promise<void> => {
    setIsLoading(true)

    if (!user) return
    if (!user.uid) return

    const { error } = await supabase.from("relationships").insert({
      status: "PENDING",
      user_a: user.uid,
      user_b: friendId,
      user_id: user.uid
    })

    if (error) {
      setIsLoading(false)
      showNotification({
        title: "Error",
        message: error.message,
        color: "red"
      })

      return
    }

    showNotification({
      title: "Friend request sent successfully",
      message: "Now, its time to wait for them to accept it."
    })

    setIsLoading(false)
  }

  const handleAcceptFriendRequest = async ({
    friendship
  }: IAcceptFriendRequest): Promise<void> => {
    setIsLoading(true)

    if (!user) return
    if (!user.uid) return

    const { error } = await supabase
      .from("relationships")
      .update({
        status: "FRIENDS",
        user_id: user.uid,
        id: friendship.id
      })
      .eq("id", friendship.id)

    if (error) {
      setIsLoading(false)
      showNotification({
        title: "Error",
        message: error.message,
        color: "red"
      })

      return
    }

    setIsLoading(false)
  }

  const handleDeleteFriendship = async ({
    friendship
  }: IRejectFriendRequest): Promise<void> => {
    setIsLoading(true)

    if (!user) return
    if (!user.uid) return

    const { error } = await supabase
      .from("relationships")
      .delete()
      .eq("id", friendship.id)

    if (error) {
      setIsLoading(false)
      showNotification({
        title: "Error",
        message: error.message,
        color: "red"
      })

      return
    }

    // @ts-expect-error
    await getUserFriends(session)
    showNotification({
      title: "Friend removed successfully",
      message: "Not friends anymore? No problem chat with guide."
    })
    navigate("/")
    setIsLoading(false)
  }

  return {
    isLoading,
    handleAcceptFriendRequest,
    handleDeleteFriendship,
    handleSendFriendRequest,
    handleMakeFriend
  }
}

export default useHandleFriendsRequests
