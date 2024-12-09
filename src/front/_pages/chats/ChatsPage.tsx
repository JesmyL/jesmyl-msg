import { AppBar, Drawer, List, Toolbar } from '@suid/material';
import { createDexieArrayQuery } from 'solid-dexie';
import { createSignal, For, Show } from 'solid-js';
import { createStore, produce } from 'solid-js/store';
import { ItChat } from '../../../shared/api/complect/chat';
import { complectIDB } from '../../_idb/complect.idb';
import { styler } from '../../css';
import { soki } from '../../soki/soki';
import { backSwipableContainerMaker } from '../../utils/backSwipableContainerMaker';
import { ChatFace } from '../chat/ChatFace';
import { ChatPage } from '../chat/ChatPage';
import { MessageListLimitsContext, MessageListLimitsSetterContext } from '../chat/Contexts';

export const ChatsPage = () => {
  const [openChatId, setOpenChatId] = createSignal(ItChat.ChatId.def);
  const closeChat = () => setOpenChatId(ItChat.ChatId.def);
  const swiper = backSwipableContainerMaker(closeChat);
  const [limits, setLimits] = createStore({ from: 0, to: 20 });

  soki.onImportableEvent(event => {
    if (event.chatsData) {
      event.chatsData.chats?.forEach(chat => complectIDB.db.chats.put(chat, chat.id));
      event.chatsData.messages?.forEach(async message => {
        if (message.isRemoved) complectIDB.db.messages.delete(message.id);
        else {
          if ((await complectIDB.db.messages.update(message.id, message)) === 0)
            complectIDB.db.messages.put(message, message.id);
        }
      });
    }
  });

  soki.send({ chatsFetch: {} });

  const chats = createDexieArrayQuery(() => complectIDB.db.chats.orderBy('title').toArray());

  const sortedChats = () =>
    chats.toSorted((a, b) =>
      b.messages[0].createdAt > a.messages[0].createdAt
        ? 1
        : b.messages[0].createdAt < a.messages[0].createdAt
          ? -1
          : 0,
    );

  return (
    <StyledPage>
      <AppBar position="sticky">
        <Toolbar></Toolbar>
      </AppBar>
      <List>
        <For each={sortedChats()}>
          {chat => (
            <ChatFace
              chat={chat}
              onFaceClick={() => setOpenChatId(chat.chatId)}
            />
          )}
        </For>
      </List>

      <Drawer
        anchor="right"
        open={!!openChatId()}
        onClose={closeChat}
        PaperProps={{ sx: { minWidth: '100vw' }, ...swiper }}
      >
        <Show when={openChatId()}>
          <MessageListLimitsContext.Provider value={limits}>
            <MessageListLimitsSetterContext.Provider
              value={cb => {
                setLimits(
                  produce(limits => {
                    cb(limits);
                    if (limits.from < 0) limits.from = 0;
                  }),
                );
              }}
            >
              <ChatPage
                chatId={openChatId()}
                onClose={closeChat}
              />
            </MessageListLimitsSetterContext.Provider>
          </MessageListLimitsContext.Provider>
        </Show>
      </Drawer>
    </StyledPage>
  );
};

const StyledPage = styler('div')({ height: '100vh' });
