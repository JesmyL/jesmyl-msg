import { ItChat } from '../../shared/api/complect/chat';

type AnyNum = number | bigint;
type WithAnyId = { id: AnyNum };
type WithAnyCreatedAt = { createdAt: string | Date };

export type TbUserMemberInChatType = WithRewrites<
  ItChat.ChatMember,
  WithAnyId & { user: WithRewrites<ItChat.ChatMemberUser, WithAnyId> }
>;
export type TbMessage = WithRewrites<
  ItChat.ImportableMessage,
  WithAnyId & WithAnyCreatedAt & { chatid: AnyNum; sentMemberId: AnyNum; replyMessageId: AnyNum | null; type: string }
>;

export type TbMiniChatInfoType<T = {}> = WithRewrites<
  ItChat.ChatMiniInfo,
  {
    messages: TbMessage[];
    members: TbUserMemberInChatType[];
    chatId: string;
    id: bigint;
  } & T
>;
