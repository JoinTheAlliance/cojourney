import React from "react"
import backgroundImage from "../../../../../public/images/background-potrait-alpha-10.svg"
import { Text, Container, Paper, useMantineTheme } from "@mantine/core"

const Splash = (): JSX.Element => {
const theme = useMantineTheme()

  return (
    <Container
      fluid
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundColor: "#0e0e0e"
      }}
    >
      <Paper
      bg={"transparent"}
      >
        <Text
          align="center"
          size={"2xl"}
          weight={500}
          mb={6}
          color={theme.colors.gray[0]}
        >
          Cojourney
        </Text>
        <Text
          align="center"
          size="md"
          color={theme.colors.gray[4]}
        >
          We&apos;re going to make it. Together.
        </Text>
      </Paper>
    </Container>
  )
}

export default Splash
