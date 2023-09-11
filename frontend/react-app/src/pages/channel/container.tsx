import { useEffect, useState } from "react";
import ChannelPageView from "./view";
import { chatSocket } from "@src/utils/sockets/chatSocket";
import { ChatType, EnterChannelReturnType } from "@src/types";
import { useNavigate, useParams } from "react-router-dom";
import {
  channelState,
  joinedChannelListState,
  messageListState,
  participantListState,
} from "@src/recoil/atoms/channel";
import { useRecoilState, useSetRecoilState } from "recoil";

const ChannelPageContainer = () => {
  const setChannel = useSetRecoilState(channelState);
  const [messageList, setMessageList] = useRecoilState(messageListState);
  const [participantList, setParticipantList] =
    useRecoilState(participantListState);
  const setJoinedChannelList = useSetRecoilState(joinedChannelListState);
  const [chatList, setChatList] = useState<ChatType[]>([]);
  const params = useParams();
  const navigate = useNavigate();

  // Assemble chat list
  useEffect(() => {
    setChatList(() => {
      const rawChatList = messageList.map((message) => {
        const from = participantList.find(
          (user) => user.user?.id === message.userId,
        );
        if (!from || !from.user) return undefined;
        else if (from.owner) return { message, user: from.user, role: "owner" };
        else if (from.admin) return { message, user: from.user, role: "admin" };
        else return { message, user: from.user, role: "attendee" };
      });
      return rawChatList.filter((chat) => chat !== undefined) as ChatType[];
    });
  }, [setChatList, messageList, participantList]);

  // Get channel info at enter
  useEffect(() => {
    const channelId = params.channelId as string;

    chatSocket.emit(
      "enter_channel",
      { channelId },
      ({ channel, messages, participants }: EnterChannelReturnType) => {
        console.log("enter_channel return", channel, messages, participants);
        if (channel && messages && participants) {
          setChannel(channel);
          setMessageList(messages);
          setParticipantList(participants);
        } else {
          setJoinedChannelList((prev) =>
            prev.filter((channel) => channel.id !== channelId),
          );
          navigate("/channel-list");
          alert("가입한 적 없거나 존재하지 않는 채널입니다.");
        }
      },
    );
    setJoinedChannelList((prev) =>
      prev.map((joinedChannel) =>
        channelId === joinedChannel.id
          ? { ...joinedChannel, hasNewMessages: false }
          : joinedChannel,
      ),
    );

    return () => {
      setChannel(null);
      setMessageList([]);
      setParticipantList([]);
    };
  }, []);

  return <ChannelPageView chatList={chatList} />;
};

export default ChannelPageContainer;
