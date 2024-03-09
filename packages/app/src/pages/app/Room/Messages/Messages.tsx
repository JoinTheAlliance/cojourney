import { Box, ScrollArea, Skeleton } from "@mantine/core";
import React, { useEffect, useRef } from "react";
import useGlobalStore, {
	type IDatabaseMessage,
} from "../../../../store/useGlobalStore";

import { type Content } from "bgent";
import EmptyRoom from "../../../../components/InfoScreens/EmptyRoom";
import Message from "./Message/Message";

const Messages = ({
	userMessage,
}: {
	userMessage: IDatabaseMessage;
}): JSX.Element => {
	const messagesEndRef = useRef<HTMLDivElement | null>(null);
	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};
	const {
		user,
		currentRoom: { messages, isLoadingMessages },
	} = useGlobalStore();

	useEffect(() => {
		setTimeout(() => {
			scrollToBottom();
		}, 1000);
	}, []);

	useEffect(() => {
		setTimeout(() => {
			scrollToBottom();
		}, 100);
	}, [messages?.length, userMessage]);

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
	if (messages.length === 0) return <EmptyRoom />;

	const filteredMessages = (
		userMessage
			? [
					...messages.filter(
						// filter out messages that match userMessage
						(message) => message.content.content !== userMessage.content.content
					),
					{ ...userMessage, userData: user },
			  ]
			: messages
	)
		.filter(
			// filter any messages where action is NEW_USER
			(message) => (message.content as Content).action !== "NEW_USER"
		)
		.sort(
			// sort by created_at
			(a, b) =>
				new Date(a.created_at!).getTime() - new Date(b.created_at!).getTime()
		);

	return (
		<ScrollArea style={{ paddingBottom: "0.5rem", flexGrow: 1 }} id="messages">
			<Box>
				{filteredMessages.map((message) => {
					return (
						<div key={message.created_at}>
							<Message key={message.id} message={message as IDatabaseMessage} />
						</div>
					);
				})}
				<div ref={messagesEndRef} />
			</Box>
		</ScrollArea>
	);
};

export default Messages;
