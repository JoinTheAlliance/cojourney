import { Edit } from "react-feather";
import React from "react";
import { ActionIcon, Flex, Tooltip } from "@mantine/core";
import useGlobalStore, {
  IDatabaseMessages,
} from "../../../../../store/useGlobalStore";

interface IMessageFunctions {
  handleEdit: () => void;
  message: IDatabaseMessages;
}
const MessageFunctions = ({
  handleEdit,
  message,
}: IMessageFunctions): JSX.Element => {
  const {
    user: { uid },
  } = useGlobalStore();

  return (
    <Flex gap={5}>
      {message.user_id === uid && (
        <Tooltip
          withArrow
          withinPortal
          label="Edit"
        >
          <ActionIcon onClick={handleEdit}>
            <Edit size="sm" />
          </ActionIcon>
        </Tooltip>
      )}
    </Flex>
  );
};

export default MessageFunctions;
