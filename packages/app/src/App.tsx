import { MantineProvider } from "@mantine/core"
import { ModalsProvider } from "@mantine/modals"
import { Notifications } from "@mantine/notifications"
import { SessionContextProvider } from "@supabase/auth-helpers-react"
import { createClient } from "@supabase/supabase-js"
import { PostHogProvider } from "posthog-js/react"
import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import "./App.css"
import LoadingOverlay from "./components/LoadingOverlay/LoadingOverlay"
import OAuthUser from "./components/OAuthUser"
import constants from "./constants/constants"
import Error404 from "./pages/404/Error404"
import FriendProfile from "./pages/app/FriendProfile"
import RoomLayout from "./pages/app/Room/index"
import Root from "./pages/app/root"
import UserPreferences from "./pages/app/UserPreferences/UserPreferences"
import UserProfile from "./pages/app/UserProfile"

const supabase = createClient(
  constants.supabaseUrl || "",
  constants.supabaseAnonKey || ""
)

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <Error404 />,
    children: [
      {
        path: "/chat/:roomId",
        element: <RoomLayout />
      },
      {
        path: "/account",
        element: <UserPreferences />
      },
      {
        path: "/profile",
        element: <UserProfile />
      },
      {
        path: "/friend",
        element: <FriendProfile />
      }
    ]
  },
  {
    path: "/login",
    element: <OAuthUser />
  }
])

const App = (): JSX.Element => {
  return (
    <SessionContextProvider supabaseClient={supabase}>
      <MantineProvider
        theme={{
          colorScheme: "dark",
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
              "#111111"
            ]
          },
          components: {
            Button: {
              defaultProps: {
                size: "xs",
                color: "blue"
              }
            }
          },
          fontSizes: {
            xxl: "1.75rem",
            "2xl": "2.25rem"
          },
          spacing: {
            xxl: "1.75rem",
            "2xl": "2rem",
            "3xl": "3rem",
            "4xl": "4rem",
            "5xl": "5rem",
            "6xl": "6rem",
            "7xl": "7rem",
            "8xl": "8rem"
          }
        }}
        withGlobalStyles
      >
        <PostHogProvider
          apiKey={constants.posthogApiKey}
          options={{
            api_host: "https://app.posthog.com"
          }}
        >
          <Notifications />
          <ModalsProvider>
            <RouterProvider router={router} />
            <LoadingOverlay />
          </ModalsProvider>
        </PostHogProvider>
      </MantineProvider>
    </SessionContextProvider>
  )
}

export default App
