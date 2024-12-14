import { KeyboardArrowLeftRounded } from '@suid/icons-material';
import { AppBar, FormControlLabel, Toolbar } from '@suid/material';
import { createDexieSignalQuery } from 'solid-dexie';
import { createSignal, Show } from 'solid-js';
import { ItChat } from '../../../../../shared/api/complect/chat';
import { authSignal } from '../../../../_idb/complect.idb';
import { styler } from '../../../../css';
import { sokim } from '../../../../soki/soki';
import { knownUtilTypographyClassNames } from '../../../../styles/known-class-names';
import { chatingIDB } from '../../_idb/chating.idb';
import { StyledChatPage } from './ChatPage.styled';
import { ChatPageContextControlsWrappers } from './ChatPageContextWrappers';
import { ChatMessageTsOnActionsContext } from './Contexts';
import { ChatInput } from './input/ChatInput';
import { ChatMessageList } from './message-list/ChatMessageList';
import { ContextedMessage } from './message/ContextedMessage';

export const ChatPage = (props: { chatId: ItChat.ChatId; onClose: () => void }) => {
  const auth = authSignal();
  const chat = createDexieSignalQuery(() => chatingIDB.db.chats.get({ chatId: props.chatId }));
  const [messageTsOnActions, setMessageTsOnActions] = createSignal<ItChat.MessageId | null>(null);

  sokim.send({
    chatFetch: {
      chatId: props.chatId,
      pullMessages: true,
    },
  });

  return (
    <Show when={chat()}>
      {chat => {
        return (
          <ChatPageContextControlsWrappers chat={chat()}>
            <ChatMessageTsOnActionsContext.Provider value={setMessageTsOnActions}>
              <StyledChatPage ownerState={{ chat: chat(), auth }}>
                <AppBar position="sticky">
                  <Toolbar>
                    <FormControlLabel
                      control={<KeyboardArrowLeftRounded />}
                      label={chat().title}
                      onClick={() => props.onClose()}
                    />
                  </Toolbar>
                </AppBar>

                <StyledContent>
                  <ChatMessageList />
                  <ChatInput />
                  <Show when={messageTsOnActions() !== null}>
                    {_ => <ContextedMessage messageId={messageTsOnActions()!} />}
                  </Show>
                </StyledContent>
              </StyledChatPage>
            </ChatMessageTsOnActionsContext.Provider>
          </ChatPageContextControlsWrappers>
        );
      }}
    </Show>
  );
};

const StyledContent = styler('div')(({ theme }) => ({
  '--stock-width': `min(600px, calc(100dvw - ${theme.spacing(2)}))`,
  '--max-message-width': 'calc(var(--stock-width) - 60px)',
  ...knownUtilTypographyClassNames['flex-column'],
  ...knownUtilTypographyClassNames['flex-middle'],
  height: 'calc(100dvh - 64px)',

  [theme.breakpoints.down('sm')]: {
    height: 'calc(100dvh - 56px)',
  },
}));
