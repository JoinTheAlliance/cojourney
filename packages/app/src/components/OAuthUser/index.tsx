import React from "react"

export default function OAuthUser () {
  return (
    <div style={{
      height: "100vh",
      width: "100vw",
      backgroundImage: "url(\"../../../public/images/background.png\")",
      backgroundSize: "cover",
      backgroundPosition: "0% 10%",
      display: "flex",
      justifyContent: "center",
      alignItems: "center"
    }}>
      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
      }}>
        <h1 style={{
          padding: "1.2rem",
          width: "20rem",
          fontWeight: "bold",
          textAlign: "center",
          color: "beige"
        }}>Cojourney</h1>
        <div style={{
          width: "20rem",
          backgroundColor: "rgba(0, 0, 0, 0.8)",
          borderRadius: "1rem",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
          padding: "2rem"
        }}>
          <h3 style={{
            fontSize: "1rem",
            fontWeight: "normal"
          }}>Please login to continue</h3>
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "1rem",
            width: "100%"
          }}>
            <img
              src={"/icons/x.svg"}
              alt="Twitter"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                cursor: "pointer"
              }}
            />
            <img
              src={"/icons/discord.svg"}
              alt="Discord"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                cursor: "pointer"
              }}
            />
            <img
              src={"/icons/google.svg"}
              alt="Google"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                cursor: "pointer"
              }}
            />
            <img
              src={"/icons/github.svg"}
              alt="Github"
              style={{
                width: "2.5rem",
                height: "2.5rem",
                cursor: "pointer"
              }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
