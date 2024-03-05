import React from "react"
import { useSupabaseClient } from "@supabase/auth-helpers-react"
import type { Provider } from "@supabase/supabase-js"
import { type Database } from "../../../types/database.types"

export default function OAuthUser () {
  const supabase = useSupabaseClient<Database>()
  const loginProviders = [
    {
      name: "Twitter",
      icon: "/icons/x.svg"
    },
    {
      name: "Discord",
      icon: "/icons/discord.svg"
    },
    {
      name: "Google",
      icon: "/icons/google.svg"
    }
    // {
    //   name: "Github",
    //   icon: "/icons/github.svg"
    // }
  ]
  const signInWithAuthProvider = async (provider: string) => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as Provider
    })
    if (error) {
      console.error("Error signing in with provider", error)
    }
  }
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        backgroundImage: "url('/images/NewBackground.jpg')",
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <h1
        style={{
          padding: "1.2rem 2.2rem",
          width: "20rem",
          fontWeight: "bold",
          // uppercase
          textTransform: "uppercase",
          position: "absolute",
          top: 0,
          left: 0,
          color: "beige"
        }}
      >
        Cojourney
      </h1>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <div
          style={{
            width: "20rem",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            borderRadius: "1rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
            padding: "2rem"
          }}
        >
          <h3
            style={{
              fontSize: "1rem"
              // fontWeight: "normal"
            }}
          >
            Login to Continue
          </h3>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              paddingTop: "1rem",
              width: "100%"
            }}
          >
            {loginProviders.map((provider, index) => (
              <img
                key={index}
                src={provider.icon}
                alt={provider.name}
                style={{
                  width: "60px",
                  height: "60px",
                  cursor: "pointer"
                }}
                onClick={async () => {
                  await signInWithAuthProvider(provider.name)
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
