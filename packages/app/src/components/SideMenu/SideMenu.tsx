import { Avatar, Navbar, Title } from "@mantine/core"
import React from "react"
import { useNavigate } from "react-router-dom"
import constants from "../../constants/constants"
import useGlobalStore from "../../store/useGlobalStore"
import useSideMenuStyles from "./SideMenu.styles"
import FriendsSideMenuScreen from "./SideMenuScreens/FriendsSideMenuScreen"

const SideMenu = (): JSX.Element => {
  const {
    setApp
  } = useGlobalStore()

  const { classes } = useSideMenuStyles()
  const navigate = useNavigate()
  return (
    <Navbar
      className={classes.container}
      width={{ sm: 400 }}
    >
      <Navbar.Section
        className={classes.wrapper}
        grow
      >
        <div className={classes.main}>
          <Title
            className={classes.title}
            order={4}
          >
            Cojourney
            <Avatar
              onClick={(): void => {
                setApp({
                  secondaryActiveSideMenu: "Settings/Account",
                  isMobileMenuOpen: false
                })
                navigate("/profile")
              }}
              radius="xl"
              size={50}
              style={{ cursor: "pointer" }}
              src={constants.avatarPlaceholder(
                "00000000-0000-0000-0000-000000000000"
              )}
            />
          </Title>

          <FriendsSideMenuScreen />
        </div>
      </Navbar.Section>
    </Navbar>
  )
}

export default SideMenu
