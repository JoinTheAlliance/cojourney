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
    setApp
  } = useGlobalStore()

  const navigate = useNavigate()

  return (
    <div
      onClick={() => {
      const friendship = friends.find(x => x.id.toString() === children.key)

      setApp({
        secondaryActiveSideMenu: friendship?.room_id,
        isMobileMenuOpen: false
      })

      navigate(`/chat/${friendship?.room_id}`)
    }}
    >
      {children}
    </div>
  )
}

export default UserPopup
