import { Flex } from "@mantine/core";

const EmptyRoom = (): JSX.Element => {
  return (
    <Flex
      direction="column"
      justify="center"
      align="center"
      sx={{ height: "70%" }}
    >
      <h1>No messages... yet</h1>
    </Flex>
  );
};

export default EmptyRoom;
