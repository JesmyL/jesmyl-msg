import { ItChat } from '../../shared/api/complect/chat';
import { PrismaTbSelectors } from './+selectors';
import { TbUserMemberInChatType } from './model';

export class TBUsers extends PrismaTbSelectors {
  static newUser(fio: string, login: string, nick: string, tgId?: number) {
    return this.tb.user.create({ data: { fio, tgId, login, nick, lastVisit: new Date() } });
  }

  static async setLastVisitOrCreate(fio: string, login: string, nick: string, tgAva?: string, tgId?: number) {
    const user = await this.tb.user.findFirst({ where: { login } });

    if (user) {
      await this.tb.user.update({
        where: { id: user.id },
        data: {
          lastVisit: new Date(),
          tgAva: tgAva ?? user.tgAva,
        },
      });
      return;
    }

    await this.tb.user.create({ data: { fio, login, nick, tgAva, tgId, lastVisit: new Date() } });
  }

  static async getAll() {
    const users: TbUserMemberInChatType['user'][] = await this.tb.user.findMany({
      select: { fio: true, id: true, login: true },
    });

    return users as never as ItChat.ChatMemberUser[];
  }

  static getByLogin = (login: string) => this.tb.user.findFirst({ where: { login } });
}
