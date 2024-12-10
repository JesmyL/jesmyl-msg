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
