import { Flex, Header, rem, useMantineTheme, Text } from "@mantine/core"
import { IconChevronLeft, IconDots } from "@tabler/icons-react"
import React from "react"
import UserAvatar from "../UserAvatar"
import { useNavigate } from "react-router-dom"
import { useMediaQuery } from "@mantine/hooks"

const AppShellHeader = ({
  title,
  src = "",
  online = true
}: {
  title: string
  src?: string
  online?: boolean
}) => {
  const theme = useMantineTheme()
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 900px)")
  return (
    <Header
      display={"flex"}
      height={60}
      px="xl"
      bg={"transparent"}
      withBorder={false}
      ml={isMobile ? 0 : "25vw"}
    >
      <Flex
        direction={"row"}
        gap={"xl"}
        align={"center"}
        style={{
          width: "100%"
        }}
        justify="space-between"
      >{
        isMobile ? <IconChevronLeft
        style={{
          cursor: "pointer",
          width: rem(32),
          height: rem(32),
          color: theme.colors.gray[6]
        }}
        onClick={() => { navigate(-1) }}
      /> : <div></div>
      }
        {src ? (
          <Flex
            direction={"row"}
            gap={"xl"}
            align={"center"}
            style={{
              cursor: "pointer"
            }}
            justify="center"
            columnGap={"sm"}
            onClick={() => { navigate("/cj-profile") }}
          >
            <UserAvatar src={src} online={online} />
            <div>
              <Text
                color={theme.white}
                size={"lg"}
                weight={"700"}
                style={{
                  lineHeight: 1
                }}
              >
                CJ
              </Text>
              <Text color={theme.colors.gray[6]} size={"xs"}>
                Online
              </Text>
            </div>
          </Flex>
        ) : (
          <Flex
            direction={"row"}
            gap={"xl"}
            align={"center"}
            style={{
              cursor: "pointer"
            }}
            justify="center"
            columnGap={"sm"}
          >
            <Text
              color={theme.white}
              size={"lg"}
              weight={"700"}
              style={{
                lineHeight: 1
              }}
            >
              {title}
            </Text>
          </Flex>
        )}

        <IconDots
          style={{
            cursor: "pointer",
            width: rem(32),
            height: rem(32),
            color: theme.colors.gray[6]
          }}
        />
      </Flex>
    </Header>
  )
}

export default AppShellHeader
