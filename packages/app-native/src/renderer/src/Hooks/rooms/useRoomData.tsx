import { useCallback, useEffect } from "react";
import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";
import { Database } from "../../../types/database.types";
import useGlobalStore from "../../store/useGlobalStore";

interface Props {
  roomId?: string;
}

const useRoomData = ({ roomId }: Props) => {
  const session = useSession();
  const supabase = useSupabaseClient<Database>();

  const { setCurrentRoom } = useGlobalStore();

  const getRoomData = useCallback(
    async (): Promise<void> => {
      if (!session) return;

      setCurrentRoom({
        isLoading: true,
        isRoomMember: false,
        roomNotFound: false,
        roomParticipants: null,
        messages: null,
        usersTyping: [],
      });

      const { error: roomDataError, data: roomDataReq } = await supabase
        .from("rooms")
        .select(
          `*, participants(*), relationships(*,  userData1:accounts!relationships_user_a_fkey(
          *
        ),
        userData2:accounts!relationships_user_b_fkey(
          *
        ),
        actionUserData:accounts!relationships_user_id_fkey(
          *
        ))`,
        )
        .eq("participants.user_id", session.user.id)
        .eq("id", roomId as string)
        .single();

      if (!roomDataReq || roomDataError) {
        setCurrentRoom({ roomNotFound: true, isLoading: false });
        return;
      }
      console.log('roomDataReq', roomDataReq)
      setCurrentRoom({ roomData: roomDataReq });

      const { data: participantsData, error: participantsError } =
        await supabase
          .from("participants")
          .select("*, userData:accounts(*)")
          .eq("room_id", roomDataReq.id);

      if (!participantsData || participantsError) {
        setCurrentRoom({ isLoading: false });

        return;
      }

      // @ts-ignore
      if (!roomDataReq.participants[0]) {
        setCurrentRoom({
          isRoomMember: false,
          roomParticipants: participantsData,
          isLoading: false,
        });

        return;
      }

      setCurrentRoom({
        roomParticipants: participantsData,
        isRoomMember: true,
        isLoading: false,
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [roomId, supabase, session],
  );

  useEffect(() => {
    if (!session) return;
    if (!roomId) return;

    setCurrentRoom({ isLoading: true });

    getRoomData().finally(() => {
      setCurrentRoom({ isLoading: false });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomId, session, getRoomData]);

  return {
    getRoomData,
  };
};

export default useRoomData;
