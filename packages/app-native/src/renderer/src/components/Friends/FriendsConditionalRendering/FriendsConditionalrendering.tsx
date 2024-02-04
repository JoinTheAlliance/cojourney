import useGlobalStore, { IFriend } from "../../../store/useGlobalStore";

interface Props {
  children: JSX.Element;
  renderIf?: "FRIENDS" | "PENDING" | "REQUEST" | "NOT_FRIENDS";
  userId: string;
}

const FriendsConditionalRendering = ({
  children,
  userId,
  renderIf = "FRIENDS",
}: Props): JSX.Element | null => {
  const { relationships, user } = useGlobalStore();

  const checkIfFriend = (friendship: IFriend) => {
    return friendship.user_a === userId || friendship.user_b === userId;
  };

  const checkIfPending = (friendship: IFriend) => {
    if (
      friendship.status === "PENDING" &&
      friendship.user_id === user.uid
    ) {
      return friendship.user_a === userId || friendship.user_b === userId;
    }

    return false;
  };

  const checkIfRequest = (friendship: IFriend) => {
    if (
      friendship.status === "PENDING" &&
      friendship.user_id !== user.uid
    ) {
      return friendship.user_a === userId || friendship.user_b === userId;
    }

    return false;
  };

  if (userId === user.uid) return null; // Don't do anything if its you

  if (renderIf === "FRIENDS") {
    const isFriends = relationships.friends.some(checkIfFriend);

    if (!isFriends) return null;

    return children;
  }

  if (renderIf === "NOT_FRIENDS") {
    const isFriends = relationships.friends.some(checkIfFriend);
    const isPending = relationships.pending.some(checkIfFriend);
    const isRequest = relationships.requests.some(checkIfFriend);

    if (isFriends || isPending || isRequest) return null;

    return children;
  }

  if (renderIf === "PENDING") {
    const isPending = relationships.pending.some(checkIfPending);

    if (!isPending) return null;

    return children;
  }

  if (renderIf === "REQUEST") {
    const isRequest = relationships.requests.some(checkIfRequest);

    if (!isRequest) return null;

    return children;
  }

  return null;
};

export default FriendsConditionalRendering;
