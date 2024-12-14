export namespace ItChat {
  export const enum ChatId {
    def = '',
  }

  export const enum Chatid {
    def = -1,
  }

  export const enum MessageId {
    def = -1,
  }

  export const enum MemberId {
    def = 0,
  }

  export const enum UserId {
    def = 0,
  }

  export enum MessageType {
    ChatCreate = 'ChatCreate',
    ChatRename = 'ChatRename',
    NewMember = 'NewMember',
    BigText = 'BigText',
    Text = 'Text',
  }

  export type StrMessageId = `${MessageId}`;

  export type MessagesHashMap = Partial<Record<ItChat.MessageId, ItChat.ImportableMessage>>;

  export type MessageDraft = {
    chatid: Chatid;
    text: string;
    prevSimpleMessageText: string;
    editId?: MessageId;
    replyId?: MessageId;
  };

  export interface ImportableMessage extends ExportableMessage {
    chatid: Chatid;
    id: MessageId;
    createdAt: string;
    sentMemberId: MemberId;
    isRemoved?: boolean;
  }

  export interface ExportableMessage {
    text: string;
    prevText?: string | nil;
    type: MessageType;
    replyMessageId?: MessageId | nil;
    editMessageId?: MessageId | nil;
  }

  export type ChatMemberUser = { fio: string; id: UserId; login: string };
  export type ChatMember = { user: ChatMemberUser; id: MemberId };
  export type UserMiniInfo = Pick<ChatMemberUser, 'fio'>;

  export interface ChatMiniInfo {
    id: Chatid;
    chatId: ChatId;
    title: string;
    messages: ImportableMessage[];
    members: ChatMember[];
  }

  export interface ChatDetails {
    chatid: Chatid;
    alternativeAccentMessageId?: ItChat.MessageId;
    accentMessageId?: ItChat.MessageId;
  }

  export type ChatLastReadTimeStamp = { messageId: ItChat.MessageId; chatId: ItChat.ChatId };

  export const editableMessageTypesSet = new Set<MessageType>([MessageType.BigText, MessageType.Text]);
}
