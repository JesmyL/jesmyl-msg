import { AppBar, Drawer, List, Toolbar } from '@suid/material';
import { createDexieArrayQuery } from 'solid-dexie';
import { createSignal, For, Show } from 'solid-js';
import { ItChat } from '../../../../../shared/api/complect/chat';
import { Eventer } from '../../../../../shared/utils';
import { styler } from '../../../../css';
import { sokim } from '../../../../soki/soki';
import { backSwipableContainerMaker } from '../../../../utils/backSwipableContainerMaker';
import { chatingIDB } from '../../_idb/chating.idb';
import { ChatFace } from '../chat/ChatFace';
import { ChatPage } from '../chat/ChatPage';
import { ChatMessagesReadingPauseListenersContext } from '../chat/Contexts';

export const ChatsPage = () => {
  const [openChatId, setOpenChatId] = createSignal(ItChat.ChatId.def);
  const closeChat = () => setOpenChatId(ItChat.ChatId.def);
  const swiper = backSwipableContainerMaker(closeChat);

  const messageReadPauseEventer = Eventer.createValue();

  let messagesReadingTimeout: TimeOut;
  // const onReadingPause = () => messageReadPauseEventer.invoke();

  chatingIDB.db.messages.hook('reading', message => {
    clearTimeout(messagesReadingTimeout);
    messagesReadingTimeout = setTimeout(messageReadPauseEventer.invoke, 70);
    return message;
  });

  chatingIDB.db.on('ready', () => {
    sokim.onImportableEvent(event => {
      if (event.chatsData) {
        event.chatsData.messages?.forEach(async message => {
          if (message.isRemoved) chatingIDB.db.messages.delete(message.id);
          else {
            if ((await chatingIDB.db.messages.update(message.id, message)) === 0)
              chatingIDB.db.messages.put(message, message.id);
          }
        });

        console.log(event.chatsData);

        if (event.chatsData.chats) chatingIDB.db.chats.bulkPut(event.chatsData.chats);

        if (event.chatsData.unreachedMessages)
          chatingIDB.db.unreachedMessages.bulkPut(event.chatsData.unreachedMessages);

        if (event.chatsData.alternativeMessages)
          chatingIDB.db.alternativeMessages.bulkPut(event.chatsData.alternativeMessages);
      }
    });

    sokim.send({ chatsFetch: {} });
  });

  const chats = createDexieArrayQuery(() => chatingIDB.db.chats.toArray());

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
          <ChatMessagesReadingPauseListenersContext.Provider value={messageReadPauseEventer}>
            <ChatPage
              chatId={openChatId()}
              onClose={closeChat}
            />
          </ChatMessagesReadingPauseListenersContext.Provider>
        </Show>
      </Drawer>
    </StyledPage>
  );
};

const StyledPage = styler('div')({ height: '100vh' });
