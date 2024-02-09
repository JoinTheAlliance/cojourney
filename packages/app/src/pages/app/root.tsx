import { ActionIcon, Burger, Drawer } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Outlet, useLocation } from "react-router-dom";
import { Database } from "../../../types/database.types";
import useListenToFriendshipChanges from "../../Hooks/relationships/useListenToFrienshipChanges";
import useListenToRoomChanges from "../../Hooks/rooms/useListenToRoomChanges";
import useListenToUnreadMessagesChanges from "../../Hooks/rooms/useListenToUnreadMessages";
import useLoadUnreadMessages from "../../Hooks/rooms/useLoadUnreadMessages";
import useLoadUserData from "../../Hooks/useLoadUserData";
import AuthUser from "../../components/AuthUser/AuthUser";
import RegisterUser from "../../components/RegisterUser/RegisterUser";
import SideMenu from "../../components/SideMenu/SideMenu";
import removeTypingIndicatorFromOfflineUsers from "../../helpers/removeTypingIndicatorFromOfflineUsers";
import useGlobalStore, { initialState } from "../../store/useGlobalStore";
import useRootStyles from "./useRootStyles";
import OAuthUser from "../../components/OAuthUser";

const Root = (): JSX.Element => {
  const { getUserFriends, getUserRoomData } = useLoadUserData();
  useListenToFriendshipChanges({ getUserFriends, getUserRoomData });
  useListenToRoomChanges({ getUserRoomData });
  useListenToUnreadMessagesChanges();

  const { getUnreadMessages } = useLoadUnreadMessages();

  const { classes } = useRootStyles();
  const location = useLocation();

  const isMobile = useMediaQuery("(max-width: 900px)");
  const session = useSession();
  const supabase = useSupabaseClient<Database>();
  const {
    user,
    app,
    setApp,
    currentRoom: { usersTyping },
    setCurrentRoom,
    dms,
    relationships: { friends, requests, pending },
  } = useGlobalStore();
  const navigate = useNavigate();

  if (location.pathname === "/" && dms.length > 0) {
    navigate(`/chat/${dms[0].id}`);
  }

  useEffect(() => {
    if (!session) return;
    if (!location) return;

    if (location.pathname === "/") {
      setCurrentRoom(initialState.currentRoom);
      setApp({
        secondaryActiveSideMenu: null,
        messageAccordionSelected: null,
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, session]);

  useEffect(() => {
    if (!session) return;

    getUnreadMessages();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  useEffect((): void | (() => void) => {
    if (!session) return;

    const channel = supabase.channel("online-accounts", {
      config: {
        presence: {
          key: session.user.email,
        },
      },
    });

    channel
      .subscribe(async (status) => {
        if (status === "SUBSCRIBED") {
          const presenceTrackStatus = await channel.track({
            user: session.user.email,
            online_at: new Date().toISOString(),
          });

          if (presenceTrackStatus === "ok") {
            await channel.untrack();
          }
        }
      })
      .on("presence", { event: "sync" }, () => {
        const state = channel.presenceState();

        removeTypingIndicatorFromOfflineUsers({
          usersTyping,
          setCurrentRoom,
          onlineUsers: state,
        });

        setApp({
          onlineUsers: state,
        });
      });

    // eslint-disable-next-line consistent-return
    return () => channel.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  if (!session) {
    return <AuthUser />;
    // return <OAuthUser />;
  }

  if (session && !user.registerComplete) {
    return <RegisterUser />;
  }
  // const hasMoreThanOneFriend = friends.length > 0 || requests.length > 0 || pending.length > 0;
  return (
    <div className={classes.container}>
      {isMobile ? (
        <>
          <div className={classes.header}>
            <h3>Cojourney</h3>
            <Burger opened={app.isMobileMenuOpen} onClick={(): void => setApp({ isMobileMenuOpen: true })} />
          </div>
          <Drawer
            onClose={(): void => setApp({ isMobileMenuOpen: false })}
            opened={app.isMobileMenuOpen}
            overlayProps={{ blur: 5 }}
            position="right"
            withCloseButton
            zIndex={100}
          >
            <SideMenu />
          </Drawer>
        </>
      ) : (
        <SideMenu />
      )}
      <div className={classes.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Root;
