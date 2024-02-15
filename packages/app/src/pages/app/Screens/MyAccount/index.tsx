import React from "react"
import {
  Text,
  Group,
  useMantineTheme,
  Flex,
  AppShell,
  Button,
  Container,
  Footer,
  Paper,
  Input,
  Select,
  Grid
} from "@mantine/core"
import userIcon from "../../../../../public/images/user-avatar-robot.svg"
import UserAvatar from "../../../../components/UserAvatar"
import AppShellHeader from "../../../../components/Header"

const MyAccount = () => {
  const theme = useMantineTheme()

  return (
    <AppShell
      padding="md"
      header={<AppShellHeader title="My Account" />}
      footer={
        <Footer p="xs" bg={"transparent"} withBorder={false} height={"auto"}>
          <Group
            mb={"lg"}
            style={{
              gap: theme.spacing.xs
            }}
          >
            <Button fullWidth variant="transparent" size="md">
              <Text color={theme.white}>Subscription Settings</Text>
            </Button>
            <Button fullWidth variant="transparent" size="md">
              <Text color={theme.colors.red[8]}>Logout</Text>
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
          size="xl"
          color={theme.colors.gray[4]}
          mt={"xl"}
          weight={"500"}
        >
          metadude
        </Text>

        <Flex direction="column" gap={16}>
          <Input.Wrapper style={{ color: "white" }}>
            <label>Location</label>
            <Input
              placeholder="San Francisco, CA"
              // p={"sm"}
              styles={{
                input: {
                  padding: "1.5rem",
                  border: "1px solid #232627",
                  borderRadius: "0.8rem",
                  backgroundColor: "#141414",
                  color: "white"
                }
              }}
            />
          </Input.Wrapper>
          <Grid gutter={"xs"}>
            <Grid.Col span={6}>
              <Input.Wrapper style={{ color: theme.white }}>
                <label>Age</label>
                <Input
                  placeholder="Your Age"
                  value={26}
                  type="Number"
                  styles={{
                    input: {
                      border: "none",
                      backgroundColor: "#232627",
                      padding: "1.5rem 1rem",
                      color: "white"
                    }
                  }}
                  style={{ marginRight: "1rem" }}
                />
              </Input.Wrapper>
            </Grid.Col>
            <Grid.Col span={6}>
              <Paper bg={"transparent"} style={{ color: "white" }}>
                <label>Pronouns</label>
                <Select
                  placeholder="He/Him"
                  styles={{
                    input: {
                      border: "none",
                      backgroundColor: "#232627",
                      padding: "1.5rem 1rem",
                      color: "white"
                    }
                  }}
                  data={[
                    { value: "He/Him", label: "He/Him" },
                    { value: "She/Her", label: "She/Her" }
                  ]}
                />
              </Paper>
            </Grid.Col>
          </Grid>
        </Flex>
      </Container>
    </AppShell>
  )
}

export default MyAccount
