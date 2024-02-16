import React, { useEffect } from "react"
import backgroundImage from "../../../../public/images/background-friends.svg"
import { Text, Container, Paper, useMantineTheme } from "@mantine/core"
import { useNavigate } from "react-router-dom"

const Splash = (): JSX.Element => {
  const theme = useMantineTheme()
  const navigate = useNavigate()

  useEffect(() => {
    const redirectToWelcome = setTimeout(() => {
      navigate("/login")
    }, 3000)

    return () => {
      clearTimeout(redirectToWelcome)
    }
  })
  return (
    <Container
      fluid
      p={"xxl"}
      style={{
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#0e0e0e"
      }}
    >
      <Text
        size={"xxl"}
        weight={600}
        mb={6}
        color={theme.colors.gray[0]}
        style={{
          textShadow: "0 0 10px #00000045",
          lineHeight: "initial"
        }}
      >
        COJOURNEY
      </Text>
      <Paper
        bg={"transparent"}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh"
        }}
      >
        <Text align="center" size="lg" color={theme.colors.gray[5]}>
          We&apos;re going to make it. Together.
        </Text>
      </Paper>
    </Container>
  )
}

export default Splash
