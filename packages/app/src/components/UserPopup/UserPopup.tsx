// TODO: Fix to support this

import React from "react"
import { useNavigate } from "react-router-dom"
import useGlobalStore from "../../store/useGlobalStore"

interface Props {
  children: JSX.Element
}

const UserPopup = ({ children }: Props): JSX.Element => {
  const {
    relationships: { friends },
    setApp,
    user: { uid }
  } = useGlobalStore()

  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
      const friendship = friends.find((friend) => {
        return friend.user_a === uid || friend.user_b === uid
      })

      setApp({
        secondaryActiveSideMenu: friendship?.room_id
      })

      navigate(`/chat/${friendship?.room_id}`)
    }}
    >
      {children}
    </div>
  )
}

export default UserPopup
