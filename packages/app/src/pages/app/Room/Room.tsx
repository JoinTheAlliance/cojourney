import { useSupabaseClient } from "@supabase/auth-helpers-react";
import React, { useEffect } from "react";
import { Database } from "../../../../types/database.types";
import useGlobalStore from "../../../store/useGlobalStore";
import Messages from "./Messages/Messages";
import MessagesTextInput from "./MessagesTextInput/MessagesTextInput";
import RoomHeader from "./RoomHeader/RoomHeader";
import useRoomStyles from "./useRoomStyles";
import useListenToMessagesChanges from "../../../Hooks/rooms/useListenToMessagesChanges";
import useTypingStatus from "../../../Hooks/rooms/useTypingStatus";
import useGetRoomMessages from "../../../Hooks/rooms/useGetRoomMessages";
import useLoadUnreadMessages from "../../../Hooks/rooms/useLoadUnreadMessages";
import AgentBinding from "./AgentBinding/AgentBinding";

interface Props {
  getRoomData: () => Promise<void>;
  roomId: string;
}

const Room = ({ roomId, getRoomData }: Props): JSX.Element => {
  const supabase = useSupabaseClient<Database>();
  const { classes } = useRoomStyles();
  const {
    currentRoom: { roomData, isRoomMember },
  } = useGlobalStore();

  const [inputHandler, setInputHandler] = React.useState<any>(null);

  // TODO:
  // if the room data participates include our default agent, we will render the AI room instead :)

  const { getRoomMessages } = useGetRoomMessages();
  const { getUnreadMessages } = useLoadUnreadMessages();

  const roomChannel = supabase.channel(roomId);

  useListenToMessagesChanges({ getRoomData });
  useTypingStatus({ roomChannel });

  useEffect(() => {
    if (!roomData?.id) return;

    const fetchData = async () => {
      getRoomMessages({ roomId: roomData.id });
      await getUnreadMessages();
    };

    fetchData();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomData]);

  return (
    <div>
      <AgentBinding roomData={roomData} setInputHandler={setInputHandler} />
      <div className={classes.headerContainer}>
        <RoomHeader />
      </div>
      <div className={classes.messagesContainer}>
        <Messages />
      </div>
      {isRoomMember && (
        <div className={classes.textInputContainer}>
          <MessagesTextInput roomChannel={roomChannel} inputHandler={inputHandler} />
        </div>
      )}
    </div>
  );
};

export default Room;
