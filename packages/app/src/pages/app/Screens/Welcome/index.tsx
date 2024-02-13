import React from "react"
import backgroundImage from "../../../../../public/images/background-potrait-alpha-50.svg"
import { Image, Button, Container, Group, Text, useMantineTheme, Flex } from "@mantine/core"
import twitter from "../../../../../public/images/x.svg"
import discord from "../../../../../public/images/discord.svg"
import google from "../../../../../public/images/google.svg"
import github from "../../../../../public/images/github.svg"

const Welcome = (): JSX.Element => {
  const theme = useMantineTheme()

  return (
    <Container
    fluid
    bg={theme.black}
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      backgroundImage: `url(${backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
      padding: theme.spacing.xl
    }}
  >
    <Text
      align="center"
      size="2xl"
      weight={600}
      style={{ color: theme.white, marginBottom: theme.spacing.xl }}
    >
      Cojourney
    </Text>

    <Button
      size="xl"
      mt={"lg"}
      mb={"4xl"}
      px={"5xl"}
      radius={"xl"}
      // py={"xl"}
      style={{
        backgroundColor: "#3202BB",
        color: theme.colors.gray[4]
      }}
    >
          <Text
      align="center"
      size="md"
      color={theme.colors.gray[3]}
    >
      Start Your Journey
    </Text>
    </Button>

    <Text
      align="center"
      size="md"
      color={theme.colors.gray[4]}
      mb={theme.spacing.xl}
    >
      Continue With Accounts
    </Text>

    <Group spacing="xs">
    <Flex
      direction={"row"}
      gap={"xl"}
      align={"center"}
      justify={{ sm: "center" }}
    >
    <Image
      src={twitter}
      style={{
        cursor: "pointer"
      }}
    />
    <Image
      src={discord}
      style={{
        cursor: "pointer"
      }}
    />
    <Image
      src={google}
      style={{
        cursor: "pointer"
      }}
    />
    <Image
      src={github}
      style={{
        cursor: "pointer"
      }}
    />
    </Flex>
    </Group>
  </Container>
  )
}

export default Welcome
