import React from "react"
import {
  Text,
  Group,
  Stack,
  useMantineTheme,
  Flex,
  rem,
  Button,
  Accordion,
  Container
} from "@mantine/core"
import iconImgSrc from "../../../../../public/icons/account.svg"
import userIcon from "../../../../../public/images/user.svg"
import user from "../../../../../public/images/user-avatar-bot.svg"
import UserAvatar from "../../../../components/UserAvatar"
import { useNavigate } from "react-router"

const connections = {
  cj: [{ name: "CJ", online: true, premium: false }],
  guides: [
    { name: "Avicii Ronaldo", online: true, premium: false },
    { name: "Mike ", online: false, premium: false },
    { name: "Oliver", online: true, premium: true }
  ],
  friends: [{ name: "Avicii Ronaldo", online: true, premium: false }],
  pending: [{ name: "Avicii Ronaldo", online: false, premium: false }]
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const ConnectionList = ({ title, list }: { title: string, list: any[] }) => {
  const theme = useMantineTheme()
  const navigate = useNavigate()

  return (
    <Accordion.Item value={title}>
      <Accordion.Control px={"xs"}>
        <Text weight={700} color={theme.white}>
          {title}
        </Text>
      </Accordion.Control>
      <Accordion.Panel>
        <Stack spacing="xs">
          {list.map((item, index) => (
            <Group
              key={index}
              noWrap
              position="apart"
              style={{
                borderRadius: theme.radius.md,
                padding: theme.spacing.xs,
                cursor: "pointer"
              }}
              onClick={() => { navigate("/chat") }}
            >
              <Group noWrap>
                <UserAvatar src={userIcon} online={item.online} />
                <Group display={"block"}>
                  <Flex align={"baseline"}>
                    <Text color={theme.white} weight={500}>
                      {item.name}
                    </Text>
                    {item.premium && (
                      <Text
                        ml={"xs"}
                        size={"xs"}
                        color={theme.colors.grape[7]}
                        weight={500}
                      >
                        PREMIUM
                      </Text>
                    )}
                  </Flex>
                  <Text size="xs" color="dimmed">
                    {item.online ? "Online" : "Offline"}
                  </Text>
                </Group>
              </Group>
            </Group>
          ))}
        </Stack>
      </Accordion.Panel>
    </Accordion.Item>
  )
}

const ConnectionsScreen = () => {
  const theme = useMantineTheme()
  const navigate = useNavigate()

  return (
    <Container fluid p={"xxl"}>
      <Flex
        direction={"row"}
        gap={"xl"}
        align={"center"}
        mb={"xl"}
        justify="space-between"
      >
        <Group>
          <UserAvatar src={user} online={true} />
          <div>
            <Text color={theme.white} weight={500}>
              metadude (me)
            </Text>
            <Text size="xs" color="dimmed">
              Online
            </Text>
          </div>
        </Group>
        <Group
          style={{
            textAlign: "center"
          }}
        >
          <Button
            size={"sm"}
            bg={"#292929"}
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "#292929",
              paddingLeft: rem(20),
              color: "#757474"
            }}
            onClick={() => { navigate("/my-account") }}
          >
            <Text mr={"md"}>My Account</Text>
            <img src={iconImgSrc} alt="Icon" width={"20px"} height={"20px"} />
          </Button>
        </Group>
      </Flex>

      <Accordion radius="xs" defaultValue="customization">
        <ConnectionList title="Guides" list={connections.guides} />
        <ConnectionList title="Friends" list={connections.friends} />
        <ConnectionList title="Pending" list={connections.pending} />
      </Accordion>
    </Container>
  )
}

export default ConnectionsScreen
