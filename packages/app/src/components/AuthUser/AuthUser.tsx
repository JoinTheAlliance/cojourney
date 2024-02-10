import { useSupabaseClient } from "@supabase/auth-helpers-react"
import { Auth } from "@supabase/auth-ui-react"
import React, { useState } from "react"
import { Card, useMantineTheme, Alert, Button, HoverCard } from "@mantine/core"
import { ThemeSupa } from "@supabase/auth-ui-shared"
import { useColorScheme } from "@mantine/hooks"
import { showNotification } from "@mantine/notifications"
import useGlobalStore from "../../store/useGlobalStore"
import { type Database } from "../../../types/database.types"

const AuthUser = (): JSX.Element => {
  const supabase = useSupabaseClient<Database>()
  const theme = useMantineTheme()
  const { preferences } = useGlobalStore()
  const colorScheme = useColorScheme()

  const [isLoadingDemoSignup, setIsLoadingDemoSignup] = useState(false)

  const handleDemoSignup = async () => {
    setIsLoadingDemoSignup(true)

    const { error } = await supabase.auth.signUp({
      email: `${Math.random().toString(36).substring(2, 15)}@demo.com`,
      password: "123456"
    })

    if (error) {
      showNotification({
        title: "Error",
        message: error.message
      })

      setIsLoadingDemoSignup(false)
    }
  }

  return (
    <Card
      withBorder
    >
      <h1>Account.</h1>
      <Auth
        appearance={{
          theme: ThemeSupa,

          variables: {
            default: {
              colors: {
                brand: theme.colors.blue[6],
                brandAccent: theme.colors.blue[7]
              }
            }
          }
        }}
        providers={["google", "discord", "twitter"]}
        redirectTo="/"
        socialLayout="horizontal"
        supabaseClient={supabase}
        theme={preferences.theme === "system" ? colorScheme : preferences.theme}
      />

      <Alert
        mt={10}
        title="Don't want to create an account?"
      >
        <p>Sign up with a demo account to explore the app</p>
        <HoverCard
          withArrow
          withinPortal
          width={300}
        >
          <HoverCard.Target>
            <Button
              onClick={async () => { await handleDemoSignup() }}
              loading={isLoadingDemoSignup}
              fullWidth
              mt={20}
            >
              Skip signup
            </Button>
          </HoverCard.Target>
          <HoverCard.Dropdown>
            <p>
              You will be signed up with a randomly generated email, and your
              password will be &quote;123456&quot;
            </p>
          </HoverCard.Dropdown>
        </HoverCard>
      </Alert>
    </Card>
  )
}

export default AuthUser
