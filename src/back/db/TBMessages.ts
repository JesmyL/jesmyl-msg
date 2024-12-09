import { MessageType, Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

import { ItChat } from '../../shared/api/complect/chat';
import { PrismaTbSelectors } from './+selectors';
import { TbMessage, TbMiniChatInfoType } from './model';
import { TBUsers } from './Users';

export class TBMessages extends PrismaTbSelectors {
  private static async getUnreachedReplyMessages(chatid: bigint, existsMessages: TbMessage[]) {
    const replyTargetIds = new Set<bigint>();
    const messageIdsSet = new Set<bigint | number>(existsMessages.map(message => message.id));

    for (const message of existsMessages) {
      if (message.replyMessageId == null || messageIdsSet.has(message.replyMessageId)) continue;

      replyTargetIds.add(message.replyMessageId as never);
    }

    const messages = replyTargetIds.size
      ? ((await this.tb.message.findMany({
          where: {
            chatid,
            isRemoved: false,
            id: { in: Array.from(replyTargetIds) },
          },
          ...this.freeMessageSelector,
          orderBy: { id: 'desc' },
        })) as TbMessage[])
      : [];

    return messages as ItChat.ImportableMessage[];
  }

  static async combineWithRemoved(
    chatId: ItChat.ChatId,
    fromMessageId?: ItChat.MessageId,
    isMessageStart?: boolean,
    fetchCount = 830,
  ) {
    return this.tb.$transaction(async () => {
      const chat = await this.tb.chat.findFirst({ where: { chatId } });

      if (chat === null) throw new Error('Чат не найден');

      const existsMessages: TbMessage[] = await this.tb.message.findMany({
        where: {
          chatid: chat.id,
          isRemoved: false,
          ...(isMessageStart == null ? null : { id: isMessageStart ? { gt: fromMessageId } : { lt: fromMessageId } }),
        },
        ...this.freeMessageSelector,
        orderBy: { id: 'desc' },
        take: fetchCount,
      });

      if (existsMessages.length < 1) throw new Error('Больше сообщений нет');

      const maxMessageId = existsMessages[0].id;
      const minMessageId = existsMessages[existsMessages.length - 1].id;

      const unreachedMessages = await this.getUnreachedReplyMessages(chat.id, existsMessages);

      if (maxMessageId === minMessageId) {
        return {
          messages: existsMessages as never as ItChat.ImportableMessage[],
          unreachedMessages,
        };
      }

      const removedMessages: { id: number | bigint; isRemoved: boolean }[] = await this.tb.message.findMany({
        where: {
          chatid: chat.id,
          isRemoved: true,
          id: {
            gt: minMessageId,
            // lt: maxMessageId,
          },
        },
        select: { id: true, isRemoved: true },
        orderBy: { id: 'desc' },
      });

      return {
        messages: [...existsMessages, ...removedMessages] as never as ItChat.ImportableMessage[],
        unreachedMessages,
      };
    });
  }

  static async pullAlternativeNearId(chatId: ItChat.ChatId, nearMessageId: ItChat.MessageId) {
    return this.tb.$transaction(async () => {
      const chat = await this.tb.chat.findFirst({ where: { chatId } });

      if (chat === null) throw new Error('Чат не найден');

      const beforeMessages: TbMessage[] = await this.tb.message.findMany({
        where: {
          chatid: chat.id,
          isRemoved: false,
          id: { lte: nearMessageId },
        },
        ...this.freeMessageSelector,
        orderBy: { id: 'desc' },
        take: 15,
      });

      const afterMessages: TbMessage[] = await this.tb.message.findMany({
        where: {
          chatid: chat.id,
          isRemoved: false,
          id: { gt: nearMessageId },
        },
        ...this.freeMessageSelector,
        orderBy: { id: 'asc' },
        take: 30 - beforeMessages.length,
      });

      const messages = [...beforeMessages, ...afterMessages];

      return {
        alternativeMessages: messages as ItChat.ImportableMessage[],
        unreachedMessages: await this.getUnreachedReplyMessages(chat.id, messages),
      };
    });
  }

  static async getChatMessages(chatId: ItChat.ChatId) {
    const messages: TbMessage[] | null = await this.tb.message.findMany({
      where: { chat: { chatId } },
      ...this.freeMessageSelector,
      orderBy: { id: 'desc' },
      take: 100,
    });

    return messages as never as ItChat.ImportableMessage[] | null;
  }

  static async sendSimpleMessage(chatId: ItChat.ChatId, senderLogin: string, message: ItChat.ExportableMessage) {
    const user = await TBUsers.getByLogin(senderLogin);

    if (user === null) throw new Error('Пользователь не найден');

    const chat = await this.tb.chat.findFirst({
      where: { chatId },
      include: { members: { select: { user: true } } },
    });

    if (chat === null) throw new Error('Чат не найден');

    const member = await this.tb.chatMember.findFirst({ where: { chatid: chat.id, userId: user.id } });

    if (member === null) throw new Error('Пользователь не может писать в этом чате');

    const sentMessage = await this.tb.message.create({
      data: {
        chatid: chat.id,
        sentMemberId: member.id,
        text: message.text,
        type: message.type,
        replyMessageId: message.replyMessageId,
        prevText: message.prevText,
      },
      ...this.freeMessageSelector,
    });

    return {
      chat,
      sentMessage: sentMessage as never as ItChat.ImportableMessage,
      unreachedMessages: await this.getUnreachedReplyMessages(chat.id, [sentMessage]),
    };
  }

  static async removeMessages(chatId: ItChat.ChatId, login: string, messageIds: ItChat.MessageId[]) {
    return await this.tb.$transaction(async () => {
      const chat = await this.tb.chat.findFirst({
        where: { chatId },
        select: { id: true },
      });

      if (chat === null) throw new Error('Чат не найден');

      const member = await this.tb.chatMember.findFirst({ where: { user: { login }, chatid: chat.id } });

      if (member === null) throw new Error('Пользователь не является участником чата');

      const where: Parameters<Prisma.MessageDelegate<DefaultArgs>['updateMany']>[0]['where'] = {
        id: { in: messageIds },
        chatid: chat.id,
        sentMemberId: member.id,
      };

      const updated = await this.tb.message.updateMany({ data: { isRemoved: true }, where });

      if (!updated.count) throw new Error('Ошибка удаления');

      const chatNewInfo: TbMiniChatInfoType | null = await this.tb.chat.findUnique({
        where: { id: chat.id },
        ...this.freeChatDataSelector(1),
      });

      return {
        chat: chatNewInfo as never as ItChat.ChatMiniInfo,
        removedMessages: (await this.tb.message.findMany({
          where,
          select: { id: true, isRemoved: true, chatid: true },
        })) as never as ItChat.ImportableMessage[],
      };
    });
  }

  static async editMessage(
    chatId: ItChat.ChatId,
    senderLogin: string,
    editMessageId: ItChat.MessageId,
    text: string,
    type: MessageType,
  ) {
    const prevMessage = await this.tb.message.findUnique({
      where: { id: editMessageId, chat: { chatId } },
      select: {
        isRemoved: true,
        text: true,
        sentMember: { select: { user: true } },
      },
    });

    if (prevMessage === null) throw new Error('Сообщение не найдено');
    if (prevMessage.sentMember.user.login !== senderLogin) throw new Error('Изменить можно только своё сообщение');
    if (prevMessage.isRemoved) throw new Error('Сообщение удалено');

    const newMessage: TbMessage = await this.tb.message.update({
      where: { id: editMessageId },
      data: { text, prevText: prevMessage.text, type },
      ...this.freeMessageSelector,
    });

    const chat: TbMiniChatInfoType | null = await this.tb.chat.findFirst({
      where: { chatId },
      ...this.freeChatDataSelector(1),
    });

    return {
      chat: chat as never as ItChat.ChatMiniInfo,
      newMessage: newMessage as never as ItChat.ImportableMessage | null,
    };
  }
}
