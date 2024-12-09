import { ArrowDownward, ReplyRounded } from '@suid/icons-material';
import { Skeleton, Stack } from '@suid/material';
import { createEffect, createSignal, For, Show } from 'solid-js';
import { styler } from '../../../css';
import { knownUtilTypographyClassNames } from '../../../styles/known-class-names';
import { RefValue, useRef } from '../../../utils/useRef';
import { useChatContext, useChatMessagesContext } from '../Contexts';
import { ChatMessagePlace } from '../message/MessagePlace';
import { chatListInteractiveListenerRef } from './complect/chatListInteractiveListenerRef';
import { useToDownButtonController } from './complect/useToDownButtonController';

export const ChatMessageList = (props: { listRef: RefValue<HTMLDivElement | null> }) => {
  const chat = useChatContext();
  const toDownButtonRef = useRef<HTMLDivElement | null>(null);
  const messages = useChatMessagesContext();
  const [replyFloatIconBoxPlaceRef, setReplyFloatIconBoxPlaceRef] = createSignal<HTMLDivElement | null>(null);
  const [replyFloatIconBoxRef, setReplyFloatIconBoxRef] = createSignal<HTMLDivElement | null>(null);

  createEffect(() => {
    const listNode = props.listRef();
    if (listNode == null) return;

    chatListInteractiveListenerRef(listNode, chat, replyFloatIconBoxRef, replyFloatIconBoxPlaceRef);
    useToDownButtonController(listNode, toDownButtonRef);
  });

  return (
    <>
      <StyledMessageList ref={props.listRef}>
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
        <div
          class="icon"
          onClick={() => {}}
        >
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
