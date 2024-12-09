import { KeyboardArrowLeftRounded } from '@suid/icons-material';
import { AppBar, FormControlLabel, Toolbar } from '@suid/material';
import { createDexieArrayQuery, createDexieSignalQuery } from 'solid-dexie';
import { createEffect, createSignal, onCleanup, Show } from 'solid-js';
import { ItChat } from '../../../shared/api/complect/chat';
import { authSignal, complectIDB } from '../../_idb/complect.idb';
import { styler } from '../../css';
import { soki } from '../../soki/soki';
import { knownUtilTypographyClassNames } from '../../styles/known-class-names';
import { addEventListenerPipe, hookEffectPipe } from '../../utils/hookEffectPipe';
import { useRef } from '../../utils/useRef';
import { StyledChatPage } from './ChatPage.styled';
import {
  ChatContext,
  ChatMessagesContext,
  ChatMessageTsOnActionsContext,
  useMessageListLimitsContext,
  useMessageListLimitsSetterContext,
} from './Contexts';
import { ChatInput } from './input/ChatInput';
import { ChatMessageList } from './message-list/ChatMessageList';
import { ContextedMessage } from './message/ContextedMessage';

export const ChatPage = (props: { chatId: ItChat.ChatId; onClose: () => void }) => {
  const auth = authSignal();
  const chat = createDexieSignalQuery(() => complectIDB.db.chats.where('chatId').equals(props.chatId).first());
  const [messageTsOnActions, setMessageTsOnActions] = createSignal<ItChat.MessageId | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);

  const limits = useMessageListLimitsContext();

  const messages = createDexieArrayQuery(() =>
    complectIDB.db.messages
      .where('chatid')
      .equals(chat()?.id ?? '')
      .and(message => !message.isRemoved)
      .reverse()
      .offset(limits.from)
      .limit(limits.from + limits.to)
      .toArray(),
  );

  soki.send({
    chatFetch: {
      chatId: props.chatId,
      pullMessages: true,
    },
  });

  const setLimits = useMessageListLimitsSetterContext();

  onCleanup(() =>
    setLimits(lims => {
      lims.from = 0;
      lims.to = 20;
    }),
  );

  createEffect(() => {
    const listNode = listRef();
    if (listNode === null) return;

    let isTopBorder = false;
    let prevIsTopBorder = false;
    let isBottomBorder = false;
    let prevIsBottomBorder = false;

    onCleanup(
      hookEffectPipe()
        .pipe(
          addEventListenerPipe(listNode, 'scroll', () => {
            isTopBorder = listNode.scrollHeight - -listNode.scrollTop < listNode.clientHeight * 2;
            isBottomBorder = -listNode.scrollTop < listNode.clientHeight * 2;

            if (!prevIsTopBorder && isTopBorder) setLimits(lims => (lims.to += 20));
            if (!prevIsBottomBorder && isBottomBorder) setLimits(lims => (lims.from -= 20));

            prevIsTopBorder = isTopBorder;
            prevIsBottomBorder = isBottomBorder;
          }),
        )
        .effect(),
    );
  });

  return (
    <Show when={chat()}>
      {chat => {
        return (
          <ChatMessageTsOnActionsContext.Provider value={setMessageTsOnActions}>
            <ChatMessagesContext.Provider value={messages}>
              <ChatContext.Provider value={chat()}>
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
                    <ChatMessageList listRef={listRef} />
                    <ChatInput listRef={listRef} />
                    <Show when={messageTsOnActions() !== null}>
                      {_ => <ContextedMessage messageId={messageTsOnActions()!} />}
                    </Show>
                  </StyledContent>
                </StyledChatPage>
              </ChatContext.Provider>
            </ChatMessagesContext.Provider>
          </ChatMessageTsOnActionsContext.Provider>
        );
      }}
    </Show>
  );
};

const StyledContent = styler('div')(({ theme }) => ({
  '--stock-width': `min(600px, calc(100vw - ${theme.spacing(2)}))`,
  '--max-message-width': 'calc(var(--stock-width) - 60px)',
  ...knownUtilTypographyClassNames['flex-column'],
  ...knownUtilTypographyClassNames['flex-middle'],
  height: 'calc(100vh - 64px)',
  [theme.breakpoints.down('sm')]: {
    height: 'calc(100vh - 56px)',
  },
}));
