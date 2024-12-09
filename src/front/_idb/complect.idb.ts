import { createDexieArrayQuery, createDexieSignalQuery } from 'solid-dexie';
import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { Auth } from '../../shared/api/complect/auth';
import { ItChat } from '../../shared/api/complect/chat';
import { DexieDB } from './_DexieDB';

type Storage = {
  auth: Auth;
  chats: ItChat.ChatMiniInfo[];
  messages: ItChat.ImportableMessage[];
  drafts: ItChat.MessageDraft[];
};

class ComplectIDB extends DexieDB<Storage> {
  constructor() {
    super('complect', {
      auth: 0,
      chats: {
        id: '++',
        title: true,
        chatId: true,
        members: true,
        messages: true,
      },
      messages: {
        id: '++',
        text: true,
        type: true,
        chatid: true,
        prevText: true,
        isRemoved: true,
        createdAt: true,
        sentMemberId: true,
        editMessageId: true,
        replyMessageId: true,
      },
      drafts: {
        chatid: '++',
        editId: true,
        prevSimpleMessageText: true,
        replyId: true,
        text: true,
      },
    });
  }

  getDrafts(chatid: ItChat.Chatid) {
    const [draft, setDraft] = createStore<{ val: ItChat.MessageDraft | null }>({ val: null });
    const sr = createDexieArrayQuery(() => complectIDB.db.drafts.where('chatid').equals(chatid).toArray());

    createEffect(() => setDraft({ val: sr[0] }));

    return draft.val;
  }
}

export const complectIDB = new ComplectIDB();

export const authSignal = createDexieSignalQuery(() => complectIDB.getSingleValue('auth'));

// complectIDB.setSingleValue('auth', {
//   fio: 'Павел 👨‍💻',
//   level: 100,
//   login: 'T166cbf17596a0c2919e4df1a6d54e66',
//   nick: 'gfirf',
//   passw: 'ddc314998f6e2dbafd0167890d3edd76',
//   tgAva: 'https://t.me/i/userpic/320/O7wMFN1MteRncm1KQavdO1Zk8kEaJsvO2WaCcyZPQbo.jpg',
//   tgId: 958383738,
// });

// complectIDB.setSingleValue('auth', {
//   fio: 'User',
//   level: 3,
//   login: '8f9bfe9d1345237cb3b2b205864da075',
//   nick: 'user',
//   passw: '731bf54651ae87d30d82ab34559947bd',
// });
