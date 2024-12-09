import { ChatMemberRights, MessageType } from '@prisma/client';
import { ItChat } from '../../shared/api/complect/chat';
import { PrismaTbSelectors } from './+selectors';
import { TbMiniChatInfoType } from './model';

export class TBChats extends PrismaTbSelectors {
  static async createChat(creatorLogin: string, title: string) {
    return this.tb.$transaction(async () => {
      const creatorUser = await this.tb.user.findFirst({ where: { login: creatorLogin } });

      if (creatorUser === null) return null;

      const chat = await this.tb.chat.create({ data: { title } });

      const member = await this.tb.chatMember.create({
        data: { userId: creatorUser.id, rights: [ChatMemberRights.Creator], chatid: chat.id },
      });

      await this.tb.message.create({
        data: {
          chatid: chat.id,
          type: MessageType.ChatCreate,
          text: title,
          sentMemberId: member.id,
        },
      });

      const createdChat: TbMiniChatInfoType | null = await this.tb.chat.findFirst({
        where: { chatId: chat.chatId },
        ...this.freeChatDataSelector(1),
      });

      return createdChat as unknown as ItChat.ChatMiniInfo;
    });
  }

  static async addMemberToChat(chatId: ItChat.ChatId, login: string) {
    const chat = await this.tb.chat.findFirst({ where: { chatId } });
    const user = await this.tb.user.findFirst({ where: { login } });
    if (chat === null || user === null) return null;
    await this.tb.chatMember.create({ data: { chatid: chat.id, userId: user.id, rights: ['User'] } });

    const updatedChat: TbMiniChatInfoType | null = await this.tb.chat.findFirst({
      where: { chatId },
      ...this.freeChatDataSelector(1),
    });

    return updatedChat as never as ItChat.ChatMiniInfo | null;
  }

  static async getFreshDataForUser(login: string) {
    const chats: TbMiniChatInfoType[] = await this.tb.chat.findMany({
      where: { members: { some: { user: { login } } } },
      ...this.freeChatDataSelector(1),
    });

    return chats as unknown as ItChat.ChatMiniInfo[];
  }
}
