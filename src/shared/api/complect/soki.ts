import { WebSocket } from 'ws';
import { Auth } from './auth';
import { ItChat } from './chat';

export type SokiServerEvent = {
  chatsData?: ChatsData;
  requestId?: string;
};

export type SokiClientEvent = {
  auth: Auth;
  fetchChats?: true;
  requestId?: string;

  chatFetch?: {
    chatId: ItChat.ChatId;
    pullMessages?:
      | true
      | {
          messageId: ItChat.MessageId;
          isMessageStart: boolean;
          fetchCount?: number;
        };
    pullAlternativeMessagesNearId?: ItChat.MessageId;
    message?: ItChat.ExportableMessage;
    newMember?: { userLogin: string };
    removeMessages?: ItChat.MessageId[];
  };
  chatsFetch?: {
    users?: true;
  };
};

export type SokiCapsule = {
  auth: Auth;
  client: WebSocket;
};

export interface ChatsData {
  chats?: ItChat.ChatMiniInfo[];
  messageLastReads?: ItChat.ChatLastReadTimeStamp[];
  messages?: ItChat.ImportableMessage[];
  unreachedMessages?: ItChat.ImportableMessage[];
  alternativeMessages?: ItChat.ImportableMessage[];
  users?: ItChat.ChatMemberUser[];
}
