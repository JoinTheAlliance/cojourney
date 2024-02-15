import { Flex, Header, rem, useMantineTheme, Text } from "@mantine/core"
import { IconChevronLeft, IconDots } from "@tabler/icons-react"
import React from "react"
import UserAvatar from "../UserAvatar"

const AppShellHeader = ({
  title,
  src = "",
  online
}: {
  title: string
  src?: string
  online?: boolean
}) => {
  const theme = useMantineTheme()
  return (
    <Header
      display={"flex"}
      height={60}
      px="xl"
      bg={"transparent"}
      withBorder={false}
    >
      <Flex
        direction={"row"}
        gap={"xl"}
        align={"center"}
        style={{
          width: "100%"
        }}
        justify="space-between"
      >
        <IconChevronLeft
          style={{
            cursor: "pointer",
            width: rem(32),
            height: rem(32),
            color: theme.colors.gray[6]
          }}
        />
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
          >
            <UserAvatar src={src} online={true} />
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
