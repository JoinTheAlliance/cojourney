import React from "react";
import { MantineProvider } from "@mantine/core";
import { useColorScheme } from "@mantine/hooks";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createClient } from "@supabase/supabase-js";
import { PostHogProvider } from "posthog-js/react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay";
import constants from "./constants/constants";
import Error404 from "./pages/404/Error404";
import RoomLayout from "./pages/app/Room/index";
import Root from "./pages/app/root";
import UserPreferences from "./pages/app/UserPreferences/UserPreferences";
import useGlobalStore from "./store/useGlobalStore";

const supabase = createClient(
  constants.supabaseUrl || "",
  constants.supabaseAnonKey || "",
);

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <>
        <Root />
      </>
    ),
    errorElement: <Error404 />,
    children: [
      {
        path: "/chat/:roomId",
        element: <RoomLayout />,
      },
      {
        path: "/account",
        element: <UserPreferences />,
      },
    ],
  },
]);

const App = (): JSX.Element => {
  const colorScheme = useColorScheme();

  const { preferences } = useGlobalStore();

  return (
    <PostHogProvider
      apiKey={constants.posthogApiKey}
      options={{
        api_host: "https://app.posthog.com",
      }}
    >
      <SessionContextProvider supabaseClient={supabase}>
        <MantineProvider
          theme={{
            // @ts-ignore
            colorScheme:
              preferences.theme === "system" ? colorScheme : preferences.theme,
            primaryColor: "blue",
            defaultRadius: "md",
            colors: {
              // override dark colors to change them for all components
              dark: [
                "#c2c2c2",
                "#a7a7a7",
                "#7e7e7e",
                "#636363",
                "#474747",
                "#3f3f3f",
                "#202020",
                "#1a1a1a",
                "#141414",
                "#111111",
              ],
            },
            components: {
              Button: {
                defaultProps: {
                  size: "xs",
                  color: "blue",
                },
              },
            },
          }}
          withGlobalStyles
        >
          <Notifications />
          <ModalsProvider>
            <RouterProvider router={router} />
            <LoadingOverlay />
          </ModalsProvider>
        </MantineProvider>
      </SessionContextProvider>
    </PostHogProvider>
  );
};

export default App;
