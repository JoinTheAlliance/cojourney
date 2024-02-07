import React from "react";
import {
  Avatar,
  Navbar,
  Title,
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";import useGlobalStore from "../../store/useGlobalStore";
import useSideMenuStyles from "./SideMenu.styles";
import FriendsSideMenuScreen from "./SideMenuScreens/FriendsSideMenuScreen";

const SideMenu = (): JSX.Element => {
  const {
    app,
    setApp,
    relationships: { friends, requests, pending },
  } = useGlobalStore();

  const { classes, cx } = useSideMenuStyles();

  const links = (): JSX.Element | JSX.Element[] => {
    return <FriendsSideMenuScreen />;
  };
  // const hasMoreThanOneFriend = friends.length > 1 || requests.length > 0 || pending.length > 0;

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
                  isMobileMenuOpen: false,
                });
                location.href = "/account";
              }
            }
            radius="xl"
              />
          </Title>

          <FriendsSideMenuScreen />
        </div>
      </Navbar.Section>
    </Navbar>
  );
};

export default SideMenu;
