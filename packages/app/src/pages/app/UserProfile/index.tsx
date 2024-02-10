import React from "react"

import { useNavigate } from "react-router-dom"
import {
  Avatar,
  Divider,
  Flex,
  Input,
  Select,
  Text,
  Title
} from "@mantine/core"
import { ChevronLeft } from "react-feather"
import { useMediaQuery } from "@mantine/hooks"
import useProfileStyles from "./index.styles"

export default function Profile () {
  const { classes } = useProfileStyles()
  const navigate = useNavigate()
  const isMobile = useMediaQuery("(max-width: 900px)")

  return (
    <div className={classes.container}>
      <Flex align="center">
        <ChevronLeft
          size={30}
          onClick={() => { navigate(-1) }}
          style={{ cursor: "pointer" }}
        />
        <Flex
          justify="center"
          className={classes.titleContainer}
        >
          <Title>Profile</Title>
        </Flex>
      </Flex>
      {!isMobile && <Divider my="xs" />}
      <Flex
        direction="column"
        align="center"
        justify="center"
        className={classes.content}
      >
        <Flex
          direction="column"
          content="space-between"
          gap={16}
        >
          <Flex
            direction="column"
            align="center"
            gap={8}
          >
            <Avatar
              size={300}
              radius={200}
            />
            <Title order={2}>metadata</Title>
          </Flex>
          <Flex
            direction="column"
            gap={16}
          >
            <Input.Wrapper label="Location">
              <Input
                placeholder="Your Location"
                classNames={{ input: classes.input }}
              />
            </Input.Wrapper>
            <Flex>
              <Input.Wrapper label="Age">
                <Input
                  placeholder="Your Age"
                  value={26}
                  type="Number"
                  classNames={{ input: classes.select }}
                  style={{ marginRight: "1rem" }}
                />
              </Input.Wrapper>
              <Select
                label="Pronouns"
                placeholder="Pick value"
                classNames={{
                  input: classes.select
                }}
                data={[
                  { value: "He/Him", label: "He/Him" },
                  { value: "She/Her", label: "She/Her" }
                ]}
              />
            </Flex>
          </Flex>
          <Flex
            direction="column"
            gap={8}
            style={{ marginTop: "4rem" }}
          >
            <Title
              style={{ textAlign: "center" }}
              order={4}
            >
              Subscription Settings
            </Title>
            <Text className={classes.logoutButton}>Logout</Text>
          </Flex>
        </Flex>
      </Flex>
    </div>
  )
}
