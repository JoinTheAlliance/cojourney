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
import userIcon from "../../../../../public/images/user.svg"
import UserAvatar from "../../../../components/UserAvatar"
import AppShellHeader from "../../../../components/Header"

const CJProfile = () => {
  const theme = useMantineTheme()

  return (
    <AppShell
      padding="md"
      header={<AppShellHeader title="CJ" />}
      footer={
        <Footer height={"auto"} p="xs" bg={"transparent"} withBorder={false}>
          <Button mb={"lg"} fullWidth variant="transparent" size="md">
            <Text color={theme.colors.red[8]}>Reset Memories</Text>
          </Button>
        </Footer>
      }
      styles={(theme) => ({
        main: { backgroundColor: theme.colors.dark[8], paddingBottom: "4rem" }
      })}
    >
      <Container maw={"100%"} p={"xxl"} style={{}}>
        <UserAvatar src={userIcon} online={true} size={"lg"} />

        <Text
          align="center"
          size="md"
          color={theme.colors.gray[4]}
          mt={"xl"}
          weight={"600"}
        >
          Cojourney Guide
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
            I&apos;m here for anything you need. No problem is too big or too
            small!
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

export default CJProfile
