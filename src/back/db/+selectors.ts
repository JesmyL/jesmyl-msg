import { Prisma, PrismaClient } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prisma = new PrismaClient({
  //   log: ['query', 'error', 'info', 'warn'],
});

export class PrismaTbSelectors {
  static readonly tb = prisma;

  protected static freeMessageSelector = {
    select: {
      id: true,
      chatid: true,
      text: true,
      prevText: true,
      type: true,
      createdAt: true,
      replyMessageId: true,
      sentMemberId: true,
    },
  } satisfies { select: Prisma.MessageSelect<DefaultArgs> };

  protected static freeChatDataSelector(takeMessagesCount: number | und, isIncludeRemovedMessages?: boolean) {
    return {
      select: {
        id: true,
        chatId: true,
        title: true,
        members: {
          select: {
            id: true,
            user: {
              select: { fio: true, login: true, id: true },
            },
          },
        },
        messages: {
          ...this.freeMessageSelector,
          where: isIncludeRemovedMessages ? undefined : { isRemoved: false },
          orderBy: { createdAt: 'desc' },
          take: takeMessagesCount,
        },
      },
    } satisfies Prisma.ChatFindManyArgs;
  }
}
