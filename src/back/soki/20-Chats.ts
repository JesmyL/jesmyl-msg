import { WebSocket } from 'ws';
import { ChatsData, SokiCapsule, SokiClientEvent } from '../../shared/api';
import { TBChats } from '../db/TBChats';
import { TBMessages } from '../db/TBMessages';
import { TBUsers } from '../db/Users';
import { SokiServerConnection } from './10-Connection';

export class SokiServerChats extends SokiServerConnection {
  constructor() {
    super();

    this.onClientConnect(client => {
      // this.doOnChatsFetchData(client);
    });

    this.onCapsuleSetValue.listen(capsule => {
      (async () => {
        if (capsule.auth?.login == null) return;
        const chats = await TBChats.getFreshDataForUser(capsule.auth.login);

        this.send({ chatsData: { chats } }, capsule.client);
      })();
    });

    this.onClientEvent(({ event, client }) => {
      this.doOnOtherEvents(event, client);
    });
  }

  private async doOnChatsFetchData(event: SokiClientEvent, client: WebSocket) {
    if (event.fetchChats === undefined) throw new Error();

    this.send({ chatsData: { users: await TBUsers.getAll() } }, client);
  }

  private sendChatsDataToMembers = (
    members: { user: { login: string } }[],
    chatsData: ChatsData,
    requestId: string | und,
    client: WebSocket,
  ) => {
    this.send({ chatsData, requestId }, client);

    const messageData = { chatsData };
    const sendDataForEach = (capsule: SokiCapsule) => {
      if (capsule.client === client) return;
      this.send(messageData, capsule.client);
    };

    members.forEach(member => {
      const capsules = this.capsulesByLogin.get(member.user.login);
      capsules?.forEach(sendDataForEach);
    });
  };

  private async doOnChatFetchData(event: SokiClientEvent, client: WebSocket) {
    if (event.chatFetch === undefined) throw new Error();

    const eventFetch = event.chatFetch;
    const chatId = eventFetch.chatId;

    if (eventFetch.newMember != null) {
      const { userLogin } = eventFetch.newMember;
      const chat = await TBChats.addMemberToChat(chatId, userLogin);
      if (chat === null) return;

      this.sendChatsDataToMembers(chat.members, { chats: [chat] }, event.requestId, client);
    }

    if (eventFetch.pullMessages != null) {
      console.log(eventFetch);
      const { messages, unreachedMessages } =
        eventFetch.pullMessages === true
          ? await TBMessages.combineWithRemoved(chatId)
          : await TBMessages.combineWithRemoved(
              chatId,
              eventFetch.pullMessages.messageId,
              eventFetch.pullMessages.isMessageStart,
              eventFetch.pullMessages.fetchCount,
            );

      if (messages === null) return;
      this.send(
        {
          chatsData: {
            messages,
            unreachedMessages,
          },
        },
        client,
      );
    }

    if (eventFetch.pullAlternativeMessagesNearId) {
      const { alternativeMessages, unreachedMessages } = await TBMessages.pullAlternativeNearId(
        chatId,
        eventFetch.pullAlternativeMessagesNearId,
      );

      this.send(
        {
          chatsData: {
            alternativeMessages,
            unreachedMessages,
          },
        },
        client,
      );
    }

    if (eventFetch.removeMessages != null) {
      const messagesForRemove = eventFetch.removeMessages;

      this.actionWithCapsule(client, async capsule => {
        if (capsule.auth?.login) {
          const { removedMessages, chat } = await TBMessages.removeMessages(
            chatId,
            capsule.auth.login,
            messagesForRemove,
          );

          this.sendChatsDataToMembers(
            chat.members,
            { messages: removedMessages, chats: [chat] },
            event.requestId,
            capsule.client,
          );
        }
      });
    }
  }

  private async doOnChatFetchMessageData(event: SokiClientEvent, client: WebSocket) {
    if (event.chatFetch?.message === undefined) throw new Error();

    const chatMessage = event.chatFetch.message;
    const chatId = event.chatFetch.chatId;

    this.actionWithCapsule(client, async capsule => {
      if (capsule.auth?.login == null) return;
      const senderLogin = capsule.auth.login;

      if (chatMessage.type === 'ChatCreate') {
        const chat = await TBChats.createChat(senderLogin, chatMessage.text);
        if (chat?.members != null) {
          this.sendChatsDataToMembers(chat.members, { chats: [chat] }, event.requestId, client);
        }
        return;
      }

      if (chatMessage.editMessageId) {
        const { chat, newMessage } = await TBMessages.editMessage(
          chatId,
          senderLogin,
          chatMessage.editMessageId,
          chatMessage.text,
          chatMessage.type,
        );

        if (chat?.members != null && newMessage != null) {
          this.sendChatsDataToMembers(chat.members, { chats: [chat], messages: [newMessage] }, event.requestId, client);
        }
        return;
      }

      try {
        const { chat, sentMessage, unreachedMessages } = await TBMessages.sendSimpleMessage(
          chatId,
          senderLogin,
          chatMessage,
        );

        this.sendChatsDataToMembers(
          chat.members,
          {
            messages: [sentMessage],
            unreachedMessages,
          },
          event.requestId,
          client,
        );
      } catch (error) {
        console.error(error);
      }
    });
  }

  async doOnOtherEvents(event: SokiClientEvent, client: WebSocket) {
    try {
      await this.doOnChatFetchMessageData(event, client);
      return false;
    } catch (e) {}

    try {
      await this.doOnChatsFetchData(event, client);
      return false;
    } catch (e) {}

    try {
      await this.doOnChatFetchData(event, client);
      return false;
    } catch (e) {}

    return false;
  }
}
