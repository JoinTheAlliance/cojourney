import React from "react";

import { useNavigate } from "react-router-dom";
import { Divider, Flex, Text, Title } from "@mantine/core";
import { ChevronLeft } from "react-feather";
import { useMediaQuery } from "@mantine/hooks";
import useProfileStyles from "./index.styles";
import UserAvatarWithIndicator from "../../../components/UserAvatarWithIndicator/UserAvatarWithIndicator";

export default function CJProfile() {
  const { classes } = useProfileStyles();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 900px)");

  return (
    <div className={classes.container}>
      <Flex align="center">
        <ChevronLeft
          size={30}
          onClick={() => navigate(-1)}
          style={{ cursor: "pointer" }}
        />
        <Flex
          justify="center"
          className={classes.titleContainer}
        >
          <Title>CJ</Title>
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
            <UserAvatarWithIndicator
              size={300}
              checkOnline
              image=""
              radius={250}
              user_email=""
            />
            <Title order={3}>Cojourney guide</Title>
          </Flex>
          <Text
            size="xs"
            italic
            color="#757474"
          >
            I’m here for anything you need. No problem is too big or too small!
          </Text>
          <Flex
            direction="column"
            gap={8}
            style={{ marginTop: "4rem" }}
          >
            <Text className={classes.logoutButton}>Reset memories</Text>
          </Flex>
        </Flex>
      </Flex>
    </div>
  );
}
