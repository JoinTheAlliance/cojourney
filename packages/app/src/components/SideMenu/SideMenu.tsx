import { Navbar, Text, useMantineTheme, Flex } from "@mantine/core"
import React from "react"
import useSideMenuStyles from "./SideMenu.styles"
import FriendsSideMenuScreen from "./SideMenuScreens/FriendsSideMenuScreen"
import AccountInfo from "../../components/AccountInfo"

const SideMenu = (): JSX.Element => {
  const { classes } = useSideMenuStyles()
  const theme = useMantineTheme()

  return (
    <Navbar className={classes.container} width={{ sm: 400 }}>
      <Navbar.Section className={classes.wrapper} grow>
        <div className={classes.main}>
          <Text
            p={"lg"}
            size={"xl"}
            weight={700}
            mb={6}
            color={theme.colors.gray[0]}
            style={{
              textShadow: "0 0 10px #00000045",
              lineHeight: "initial"
            }}
          >
            COJOURNEY
          </Text>

          <Flex direction={"column"} justify={"space-between"}>
            <FriendsSideMenuScreen />
            <AccountInfo />
          </Flex>
        </div>
      </Navbar.Section>
    </Navbar>
  )
}

export default SideMenu
