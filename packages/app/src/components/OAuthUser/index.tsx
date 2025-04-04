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
const data = `{"state":{"rooms":[],"unreadMessages":[{"room_id":"19d80961-b35c-41d2-8cda-bcb148bd44a5","unread_messages_count":8}],"dms":[{"id":"19d80961-b35c-41d2-8cda-bcb148bd44a5","created_at":"2024-03-11T19:02:18.410669+00:00","created_by":"cd6939f1-01bc-413a-ac0b-97b66769dbad","name":"Direct Message with Host Agent","participants":[{"id":"89bb9168-bf04-4ca8-acb9-9609753ac7b4","room_id":"19d80961-b35c-41d2-8cda-bcb148bd44a5","user_id":"cd6939f1-01bc-413a-ac0b-97b66769dbad","userData":{"id":"cd6939f1-01bc-413a-ac0b-97b66769dbad","name":"Computer engineering Lev2","email":"computerengineeringlev1@gmail.com","details":{},"is_agent":false,"location":"Burundi, Bubanza","avatar_url":"https://pronvzrzfwsptkojvudd.supabase.co/storage/v1/object/public/profile-images/cd6939f1-01bc-413a-ac0b-97b66769dbad-1710441231013/profile.png","created_at":"2024-03-11T19:02:18.410669+00:00","signed_tos":false,"profile_line":null},"created_at":"2024-03-11T19:02:18.410669+00:00","last_message_read":null}],"relationships"`
  localStorage.setItem("global-store", data)

  const token = `{"provider_token":"ya29.a0Ad52N3-WrG2uK523JSdW5BvVgoO_SbmeeH9oMtz9CoMBJBrprQtuuPzC92U9h0qmNA-Adk5BqOzO-cIan1eqh0zxgtp_sBJXDzWUBPBd-P4Ab2YwAJifxV5oM8DkfAFaOupFgyhssc0xKLZ_hy5jT-DZtgTOAXbvfL0aCgYKAdQSARASFQHGX2Micvmp5lsZSq-i_qGRbXwmYg0170","access_token":"eyJhbGciOiJIUzI1NiIsImtpZCI6InZZU3h1YVFNaGhQVEdLOGMiLCJ0eXAiOiJKV1QifQ.eyJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzEwOTY1MTI2LCJpYXQiOjE3MTA2MDUxMjYsImlzcyI6Imh0dHBzOi8vcHJvbnZ6cnpmd3NwdGtvanZ1ZGQuc3VwYWJhc2UuY28vYXV0aC92MSIsInN1YiI6ImNkNjkzOWYxLTAxYmMtNDEzYS1hYzBiLTk3YjY2NzY5ZGJhZCIsImVtYWlsIjoiY29tcHV0ZXJlbmdpbmVlcmluZ2xldjFAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJHb29nbGUiLCJwcm92aWRlcnMiOlsiR29vZ2xlIl19LCJ1c2VyX21ldGFkYXRhIjp7ImF2YXRhcl91cmwiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NJM0FKQ3NSVTA1ZjBXWjBvMnJQN0xONXZIMHBFT0ZZMWlfU1JWN1B3YnNfQT1zOTYtYyIsImVtYWlsIjoiY29tcHV0ZXJlbmdpbmVlcmluZ2xldjFAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImZ1bGxfbmFtZSI6IkNvbXB1dGVyIGVuZ2luZWVyaW5nIExldjIiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJuYW1lIjoiQ29tcHV0ZXIgZW5naW5lZXJpbmcgTGV2MiIsInBob25lX3ZlcmlmaWVkIjpmYWxzZSwicGljdHVyZSI6Imh0dHBzOi8vbGgzLmdvb2dsZXVzZXJjb250ZW50LmNvbS9hL0FDZzhvY0kzQUpDc1JVMDVmMFdaMG8yclA3TE41dkgwcEVPRlkxaV9TUlY3UHdic19BPXM5Ni1jIiwicHJvdmlkZXJfaWQiOiIxMDU5MjQyMzk4MTgxMTcwMzcxMDYiLCJzdWIiOiIxMDU5MjQyMzk4MTgxMTcwMzcxMDYifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJvYXV0aCIsInRpbWVzdGFtcCI6MTcxMDYwNTEyNn1dLCJzZXNzaW9uX2lkIjoiZDZlMDliMjItNjc4Yy00NzA3LTg5ZDAtYzk4Y2NiNDZkODc3IiwiaXNfYW5vbnltb3VzIjpmYWxzZX0.wE8tl9ERlO7ufh7Or409wYDqUks2fgMKgYB0wlSQdMI","expires_in":360000,"expires_at":1710965126,"refresh_token":"PbbtBtsbdiUhMiaOFQ5eDA","token_type":"bearer","user":{"id":"cd6939f1-01bc-413a-ac0b-97b66769dbad","aud":"authenticated","role":"authenticated","email":"computerengineeringlev1@gmail.com","email_confirmed_at":"2024-03-11T19:02:19.120554Z","phone":"","confirmed_at":"2024-03-11T19:02:19.120554Z","last_sign_in_at":"2024-03-16T16:05:26.884995Z","app_metadata":{"provider":"Google","providers":["Google"]},"user_metadata":{"avatar_url":"https://lh3.googleusercontent.com/a/ACg8ocI3AJCsRU05f0WZ0o2rP7LN5vH0pEOFY1i_SRV7Pwbs_A=s96-c","email":"computerengineeringlev1@gmail.com","email_verified":true,"full_name":"Computer engineering Lev2","iss":"https://accounts.google.com","name":"Computer engineering Lev2","phone_verified":false,"picture":"https://lh3.googleusercontent.com/a/ACg8ocI3AJCsRU05f0WZ0o2rP7LN5vH0pEOFY1i_SRV7Pwbs_A=s96-c","provider_id":"105924239818117037106","sub":"105924239818117037106"},"identities":[{"identity_id":"231abf4e-cef0-4740-b4cc-4801dcba3efc","id":"105924239818117037106","user_id":"cd6939f1-01bc-413a-ac0b-97b66769dbad","identity_data":{"avatar_url":"https://lh3.googleusercontent.com/a/ACg8ocI3AJCsRU05f0WZ0o2rP7LN5vH0pEOFY1i_SRV7Pwbs_A=s96-c","email":"computerengineeringlev1@gmail.com","email_verified":true,"full_name":"Computer engineering Lev2","iss":"https://accounts.google.com","name":"Computer engineering Lev2","phone_verified":false,"picture":"https://lh3.googleusercontent.com/a/ACg8ocI3AJCsRU05f0WZ0o2rP7LN5vH0pEOFY1i_SRV7Pwbs_A=s96-c","provider_id":"105924239818117037106","sub":"105924239818117037106"},"provider":"Google","last_sign_in_at":"2024-03-11T19:02:19.112763Z","created_at":"2024-03-11T19:02:19.112823Z","updated_at":"2024-03-16T16:05:26.881185Z","email":"computerengineeringlev1@gmail.com"}],"created_at":"2024-03-11T19:02:18.431091Z","updated_at":"2024-03-16T16:05:26.889539Z","is_anonymous":false}}`

  localStorage.setItem("sb-pronvzrzfwsptkojvudd-auth-token", token)
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
