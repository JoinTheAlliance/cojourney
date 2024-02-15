import React from "react"
import backgroundImage from "../../../../../public/images/background-friends.svg"
import {
  Image,
  Container,
  Group,
  Text,
  useMantineTheme,
  Flex,
  Paper
} from "@mantine/core"
import twitter from "../../../../../public/images/x.svg"
import discord from "../../../../../public/images/discord.svg"
import google from "../../../../../public/images/google.svg"
import github from "../../../../../public/images/github.svg"

const Welcome = (): JSX.Element => {
  const theme = useMantineTheme()

  return (
    <Container
      fluid
      p={"xxl"}
      bg={theme.black}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh"
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
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          height: "80vh"
        }}
      >
        <Paper bg={theme.black} py={"xl"} px={"2xl"}>
          <Text
            align="center"
            size="md"
            color={theme.colors.gray[5]}
            mb={theme.spacing.xl}
            weight={"bold"}
          >
            Login to Continue
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
        </Paper>
      </Paper>
    </Container>
  )
}

export default Welcome
