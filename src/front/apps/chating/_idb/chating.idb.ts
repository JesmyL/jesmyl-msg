import { createDexieArrayQuery, createDexieSignalQuery } from 'solid-dexie';
import { createEffect } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ItChat } from '../../../../shared/api/complect/chat';
import { DexieDB } from '../../../_idb/_DexieDB';

type Storage = {
  chats: ItChat.ChatMiniInfo[];
  messages: ItChat.ImportableMessage[];
  unreachedMessages: ItChat.ImportableMessage[];
  alternativeMessages: ItChat.ImportableMessage[];
  drafts: ItChat.MessageDraft[];
  chatDetails: ItChat.ChatDetails[];
};

const messageQueries: Partial<Record<keyof ItChat.ImportableMessage, true | '++'>> = {
  id: '++',
  chatid: true,
};

class ChatingIDB extends DexieDB<Storage> {
  constructor() {
    super('chating', {
      chats: {
        id: '++',
        chatId: true,
      },
      messages: {
        ...messageQueries,
      },
      unreachedMessages: messageQueries,
      alternativeMessages: messageQueries,
      drafts: {
        chatid: '++',
      },
      chatDetails: {
        chatid: '++',
      },
    });
  }

  getDrafts(chatid: ItChat.Chatid) {
    const [draft, setDraft] = createStore<{ val: ItChat.MessageDraft | null }>({ val: null });
    const sr = createDexieArrayQuery(() => chatingIDB.db.drafts.where('chatid').equals(chatid).toArray());

    createEffect(() => setDraft({ val: sr[0] }));

    return draft.val;
  }

  useChatDetails(chatid: ItChat.Chatid) {
    const chatDetails = createDexieArrayQuery(() => this.db.chatDetails.where({ chatid }).toArray());

    return () => chatDetails[0] ?? { chatid };
  }

  useChatAccentMessageId(chatid: ItChat.Chatid) {
    const chatDetails = this.useChatDetails(chatid);
    const message = createDexieSignalQuery(() => this.db.messages.where({ chatid }).last());
    return () => chatDetails().accentMessageId ?? message()?.id;
  }

  useUpdateChatDetails(chatid: ItChat.Chatid) {
    return async (details: Partial<ItChat.ChatDetails>) => {
      if ((await this.db.chatDetails.update(chatid, details)) === 0) {
        this.db.chatDetails.put({ ...details, chatid });
      }
    };
  }
}

export const chatingIDB = new ChatingIDB();
