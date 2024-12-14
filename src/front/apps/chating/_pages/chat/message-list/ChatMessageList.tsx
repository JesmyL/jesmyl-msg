import { ArrowDownward, ReplyRounded } from '@suid/icons-material';
import { Skeleton, Stack } from '@suid/material';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { styler } from '../../../../../css';
import { sokim } from '../../../../../soki/soki';
import { knownUtilTypographyClassNames } from '../../../../../styles/known-class-names';
import { useRef } from '../../../../../utils/useRef';
import { chatingIDB } from '../../../_idb/chating.idb';
import {
  useChatContext,
  useChatMessagesContext,
  useMessageListLimitsUpdateContext,
  useMessagesListRefContext,
} from '../Contexts';
import { ChatMessagePlace } from '../message/MessagePlace';
import { chatListInteractiveListenerRef } from './complect/chatListInteractiveListenerRef';
import { useOnScrolledToLimitEventer } from './complect/useOnScrolledToLimitEventer';
import { useToDownButtonController } from './complect/useToDownButtonController';

export const ChatMessageList = () => {
  const chat = useChatContext();
  const toDownButtonRef = useRef<HTMLDivElement | null>(null);
  const messages = useChatMessagesContext();
  const [replyFloatIconBoxPlaceRef, setReplyFloatIconBoxPlaceRef] = createSignal<HTMLDivElement | null>(null);
  const [replyFloatIconBoxRef, setReplyFloatIconBoxRef] = createSignal<HTMLDivElement | null>(null);
  const listRef = useMessagesListRefContext();
  const updateLimits = useMessageListLimitsUpdateContext();
  // const updateChatDetails = complectIDB.useUpdateChatDetails(chat.id);
  const chatDetails = chatingIDB.useChatDetails(chat.id);

  createEffect(() => {
    const accentMessageId = chatDetails().accentMessageId;

    if (accentMessageId == null) return;

    setTimeout(() => {
      const messageNode = listRef()?.querySelector(`[message-id="${accentMessageId}"]`);

      if (messageNode == null) return;

      messageNode.scrollIntoView({ block: 'center' });
    }, 100);
  });

  createEffect(() => {
    const listNode = listRef();
    if (listNode == null) return;

    chatListInteractiveListenerRef(listNode, chat, replyFloatIconBoxRef, replyFloatIconBoxPlaceRef);
    useToDownButtonController(listNode, toDownButtonRef);
    useOnScrolledToLimitEventer(listNode).listen(async isMessageStart => {
      if (isMessageStart) {
        updateLimits(lims => ({
          ...lims,
          from: lims.from - 20,
          accentAfter: lims.accentAfter + 30,
        }));

        // // console.log(messages);
        // // const message = await complectIDB.db.messages.where({ chatid: chat.id }).last();
        // const min10 = messages[messages.length - 10]?.id;
        // const last = messages[messages.length - 1]?.id;

        // console.log({ min10, last });

        // updateChatDetails({ accentMessageId: min10 ?? last });
      } else {
        // const message = await complectIDB.db.messages.where({ chatid: chat.id }).first();

        // const plus10 = messages[10]?.id;
        // const first = messages[0]?.id;
        // console.log({ first, plus10 });

        // updateChatDetails({ accentMessageId: plus10 ?? first });

        updateLimits(lims => ({
          ...lims,
          to: lims.to + 20,
          accentBefore: lims.accentBefore + 30,
        }));
      }

      const messagesCollection = chatingIDB.db.messages.where({ chatid: chat.id });
      const firstMessage = await messagesCollection.first();
      const lastMessage = await messagesCollection.last();

      if (firstMessage === undefined || lastMessage === undefined) return;

      const messageId = isMessageStart
        ? Math.max(firstMessage.id, lastMessage.id)
        : Math.min(firstMessage.id, lastMessage.id);

      console.log({ firstMessage, lastMessage });

      sokim.send({
        chatFetch: {
          chatId: chat.chatId,
          pullMessages: {
            isMessageStart,
            messageId,
            fetchCount: 30,
          },
        },
      });
    });
  });

  return (
    <>
      <StyledMessageList ref={listRef}>
        <Show
          when={messages.length}
          children={
            <For
              each={messages}
              children={(message, messagei) => {
                return (
                  <ChatMessagePlace
                    message={message}
                    nextMessage={messages[messagei() + 1]}
                  />
                );
              }}
            />
          }
          fallback={
            <Stack spacing={1}>
              <Skeleton
                variant="rectangular"
                width="clamp(130px, 50vw, 500px)"
                height={100}
              />
              <Skeleton
                variant="rectangular"
                width="clamp(150px, 30vw, 300px)"
                height={118}
              />
            </Stack>
          }
        />
      </StyledMessageList>

      <ToDownButtonBox ref={toDownButtonRef}>
        <div class="icon">
          <ArrowDownward />
        </div>
      </ToDownButtonBox>

      <StyledReplyFloatIconBoxPlace ref={setReplyFloatIconBoxPlaceRef}>
        <StyledReplyFloatIconBox ref={setReplyFloatIconBoxRef}>
          <StyledSecretChatReplyIcon />
        </StyledReplyFloatIconBox>
      </StyledReplyFloatIconBoxPlace>
    </>
  );
};

const ToDownButtonBox = styler('div')(({ theme }) => ({
  ...knownUtilTypographyClassNames.relative,
  width: '100%',

  '&.show .icon': {
    scale: '1',
  },

  '.icon': {
    ...knownUtilTypographyClassNames['flex-centered'],
    ...knownUtilTypographyClassNames.absolute,
    ...knownUtilTypographyClassNames.pointer,
    right: theme.spacing(1),
    bottom: theme.spacing(1),
    borderRadius: '50%',
    backgroundColor: theme.palette.success.dark,
    color: theme.palette.success.light,
    aspectRatio: '1 / 1',
    height: '40px',
    scale: '0',
    transition: 'scale .2s linear',
  },
}));

const StyledReplyFloatIconBoxPlace = styler('div')({
  '*': {
    display: 'none',
  },
});

const StyledMessageList = styler('div')({
  ...knownUtilTypographyClassNames['flex-column-reverse'],
  ...knownUtilTypographyClassNames['full-size'],
  ...knownUtilTypographyClassNames['margin-gap-v'],
  ...knownUtilTypographyClassNames['show-scrollbar'],
  width: 'var(--stock-width)',
  margin: 'auto',
  overflowY: 'auto',
  overflowX: 'hidden',
});

export const StyledReplyFloatIconBox = styler('div')({
  ...knownUtilTypographyClassNames.absolute,
  ...knownUtilTypographyClassNames['flex-center'],
  right: '-20px',
  top: 0,
  bottom: 0,
});

export const StyledSecretChatReplyIcon = styler(ReplyRounded)({
  ...knownUtilTypographyClassNames.absolute,
  scale: 'var(--reply-swipe-progress)',
});
