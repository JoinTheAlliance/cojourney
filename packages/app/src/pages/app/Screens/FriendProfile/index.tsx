import React from "react"
import {
  Text,
  Group,
  useMantineTheme,
  AppShell,
  Button,
  Container,
  Footer
} from "@mantine/core"
import userIcon from "../../../../../public/images/user-avatar-bot.svg"
import UserAvatar from "../../../../components/UserAvatar"
import AppShellHeader from "../../../../components/Header"

const FriendProfile = () => {
  const theme = useMantineTheme()

  return (
    <AppShell
      padding="md"
      header={<AppShellHeader title="Avicii Ronaldo" />}
      footer={
        <Footer p="xs" bg={"transparent"} withBorder={false} height={"auto"}>
          <Group
            mb={"lg"}
            style={{
              gap: theme.spacing.xs
            }}
          >
            <Button fullWidth variant="transparent" size="md">
              <Text color={theme.white}>Unfriend</Text>
            </Button>
            <Button fullWidth variant="transparent" size="md">
              <Text color={theme.colors.red[8]}>Block</Text>
            </Button>
          </Group>
        </Footer>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.dark[8], paddingBottom: "4rem" }
      })}
    >
      <Container maw={"100%"} p={"xxl"} style={{}}>
        <UserAvatar src={userIcon} online={true} size="lg" />

        <Text
          align="center"
          size="md"
          color={theme.colors.gray[4]}
          mt={"xl"}
          weight={"500"}
        >
          8 Mutual Connections
        </Text>
        <Group>
          <Text
            size="sm"
            color={theme.colors.gray[4]}
            mt={"2xl"}
            // mb={"sm"}
            weight={"400"}
            italic={true}
          >
            “Friendly, really likes cats, looking for love in the Bay Area.
          </Text>
          <Text
            w={"100%"}
            align="right"
            size="sm"
            color={theme.colors.gray[4]}
            weight={"400"}
          >
            --CJ
          </Text>
        </Group>
      </Container>
    </AppShell>
  )
}

export default FriendProfile
