import { Box, ScrollArea, Skeleton } from "@mantine/core";
import { AnimatePresence, motion } from "framer-motion";
import React, { useEffect, useRef } from "react";
import useGlobalStore from "../../../../store/useGlobalStore";

import EmptyRoom from "../../../../components/InfoScreens/EmptyRoom";
import Message from "./Message/Message";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../../../../types/database.types";

const EMPTY_MESSAGE = "*complete silence*";

const Messages = (): JSX.Element => {
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
    // console.log("messagesEndRef.current scroll", messagesEndRef.current)
  };

  // console.log("messagesEndRef", messagesEndRef.current)

  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  const {
    currentRoom: { messages, isLoadingMessages, roomData },
  } = useGlobalStore();

  const sendUserIsSilentMessage = async () => {
    const userIds: string[] = [];

    const roomDataRelationships = (
      roomData as unknown as {
        relationships: { user_a: string; user_b: string };
      }
    ).relationships as unknown as Array<{ user_a: string; user_b: string }>;

    // add all userIds from the roomData.relationships array, check user_a or user_b
    roomDataRelationships.forEach((relationship) => {
      if (!userIds.includes(relationship.user_a)) {
        userIds.push(relationship.user_a);
      }

      if (!userIds.includes(relationship.user_b)) {
        userIds.push(relationship.user_b);
      }
    });

    const message = EMPTY_MESSAGE;
    const { data, error } = await supabase
      .from("messages")
      .insert({
        content: { content: message },
        room_id: roomData?.id,
        is_edited: false,
        user_id: session?.user.id,
        user_ids: userIds,
      })
      .select()
      .single();

    if (!data || error) {
      console.error("Unable to send message.");
    }
  };

  useEffect(() => {
    if (messages?.length == 0) {
      sendUserIsSilentMessage();
    }
    scrollToBottom();
  }, [messages?.length]);

  if (isLoadingMessages) {
    return (
      <>
        <Skeleton h={30} mb={10} width="50%" />
        <Skeleton h={30} mb={10} width="80%" />
        <Skeleton h={30} mb={10} width="35%" />
        <Skeleton h={30} mb={10} width="40%" />
        <Skeleton h={30} mb={10} width="60%" />
        <Skeleton h={30} mb={10} width="20%" />
        <Skeleton h={30} mb={10} width="30%" />
      </>
    );
  }

  if (!messages) return <p>Error loading messages</p>;

  const noMessages = () => {
    if (messages.length == 1 && messages[0].content.content == EMPTY_MESSAGE) {
      return true;
    }

    return false;
  };

  if (noMessages()) return <EmptyRoom />;

  return (
    <ScrollArea w="100%" h="calc(100%)">
      <Box>
        {messages.map((message) => {
          return (
            <div key={message.id}>
              <motion.div layout key={message.id}>
                <AnimatePresence>
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Message key={message.id} message={message} />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>
    </ScrollArea>
  );
};

export default Messages;
