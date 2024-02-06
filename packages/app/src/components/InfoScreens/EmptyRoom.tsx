import React from "react";
import { Flex } from "@mantine/core";

const EmptyRoom = (): JSX.Element => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      style={{ height: "70%" }}
    >
      <h1>No messages... yet</h1>
    </Flex>
  );
};

export default EmptyRoom;
