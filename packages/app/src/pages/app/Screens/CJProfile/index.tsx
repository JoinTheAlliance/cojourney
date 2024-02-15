import React from "react"
import { Avatar, Text, Group, useMantineTheme, Header, Flex, rem, AppShell, Button, Switch } from "@mantine/core"
import { IconDots, IconChevronLeft } from "@tabler/icons-react"
import userIcon from "../../../../../public/images/user.svg"

const UserAvatar = ({ src, alt, online }: { src: string, alt: string, online: boolean }) => {
  return (
    <Group position="center">
      <div style={{ position: "relative" }}>
        <Avatar src={src} alt={alt} radius="50%"
        style={{
          width: "10rem",
          height: "10rem"
        }} />
        <div style={{
          width: "30px",
          height: "30px",
          borderRadius: "50%",
          backgroundColor: online ? "green" : "gray",
          position: "absolute",
          right: "0",
          bottom: "0",
          border: "2px solid white", // Adjust the color based on your app's background
          transform: "translate(-25%, -25%)" // Center the badge to the outer edge of the avatar
        }} />
      </div>
    </Group>
  )
}

const CJProfile = () => {
  const theme = useMantineTheme()

  return (
    <AppShell
    padding="md"
    header={
    <Header display={"flex"} height={60} bg={theme.colors.dark[8]} withBorder={false} px={"2xl"}>

  <Flex
    direction={"row"}
    gap={"xl"}
    align={"center"}
    style={{
      width: "100%"
    }}
    justify='space-between'
  >
  <IconChevronLeft
  style={{
    cursor: "pointer",
    width: rem(32),
    height: rem(32)
  }}/>
  <Flex
    direction={"row"}
    gap={"xl"}
    align={"center"}
    style={{
      cursor: "pointer"
    }}
    justify='center'
    columnGap={"sm"}
  >
    <div>
    <Text size={"lg"} weight={"800"} style={{
    }}>CJ</Text>
    </div>

  </Flex>

  <IconDots
  style={{
    cursor: "pointer",
    width: rem(32),
    height: rem(32)
  }}/>
  </Flex>

    </Header>}
    styles={(theme) => ({
      main: { backgroundColor: theme.colors.dark[8],
      paddingBottom: "4rem" }
    })}
  >
          <UserAvatar src={userIcon} alt="User avatar" online={true} />

          <Text
          align="center"
          size="md"
          color={theme.colors.gray[4]}
          mt={"xl"}
        >
          Cojourney Guide
        </Text>
        <Flex
        my={"4xl"}
        direction={"column"}
        rowGap={"sm"}
        justify={"center"}
        align={"center"}>
          <div>
          <Switch
              size="md"
              mb={"sm"}
      label="Friendship Connections"/>
                  <Switch
              size="md"

      label="Partnership Connections"
    />
          </div>

          </Flex>
        <Flex
        justify={"center"}>
        <Button
      size="lg"
      mt={"lg"}
      px={"3xl"}
      radius={"lg"}
      style={{
        backgroundColor: theme.colors.red[9],
        color: theme.colors.gray[4],
        alignSelf: "center"
      }}
    >
          <Text
      align="center"
      size="sm"
      color={theme.colors.gray[3]}
    >
      Reset Memories
    </Text>
    </Button>
        </Flex>
  </AppShell>

  )
}

export default CJProfile
