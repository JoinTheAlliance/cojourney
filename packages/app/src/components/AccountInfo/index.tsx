import React from "react"
import {
  Text,
  Group,
  useMantineTheme,
  Flex,
  rem,
  Button
} from "@mantine/core"
import iconImgSrc from "../../../public/icons/account.svg"
import UserAvatar from "../UserAvatar"
import { useNavigate } from "react-router"
import useGlobalStore from "../../store/useGlobalStore"

const MyAccountInfo = () => {
  const {
    user,
    setApp,
  } = useGlobalStore()
  const theme = useMantineTheme()
  const navigate = useNavigate()
  return (
    <Flex
    pos={"absolute"}
    bottom={"0"}
    w={"100%"}
    p={"xl"}
    direction={"row"}
    gap={"xl"}
    align={"center"}
    justify="space-between"
    style={{
      borderTop: "0.0625rem solid #2A2A2A"
    }}
  >
    <Group>
      <UserAvatar src={user.imageUrl || ''} online={true} />
      <div>
        <Text color={theme.white} weight={500}>
          {user.name}
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
        onClick={() => {  navigate("/profile"), setApp({ isMobileMenuOpen: false }) }}
      >
        <Text mr={"md"}>My Account</Text>
        <img src={iconImgSrc} alt="Icon" width={"20px"} height={"20px"} />
      </Button>
    </Group>
  </Flex>
  )
}

export default MyAccountInfo
