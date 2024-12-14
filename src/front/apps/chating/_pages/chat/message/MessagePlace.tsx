import { Chip } from '@suid/material';
import { Show } from 'solid-js';
import { ItChat } from '../../../../../../shared/api/complect/chat';
import { smylib } from '../../../../../../shared/utils';
import { css, keyframes, styler } from '../../../../../css';
import { joinKnownClassNames } from '../../../../../styles/known-class-names';
import { secretChatClassNamesDict } from '../ChatPage.styled';
import { ChatMessage } from './Message';

interface Props {
  class?: string;
  message: ItChat.ImportableMessage;
  nextMessage: ItChat.ImportableMessage | nil;
}

const relativeTimeFormatter = new Intl.RelativeTimeFormat('ru', { style: 'long', numeric: 'auto' });

export const ChatMessagePlace = (props: Props) => {
  const date = new Date(props.message.createdAt);

  const writtenDateLabel = () => {
    if (props.nextMessage == null) return;
    const nextDate = new Date(props.nextMessage.createdAt);

    if (date.toLocaleDateString() === nextDate.toLocaleDateString()) return;

    const todayDate = new Date();
    const nextDayDate = new Date(date);

    todayDate.setHours(0, 0, 0, 0);
    nextDayDate.setHours(0, 0, 0, 0);

    const diff = (nextDayDate.getTime() - todayDate.getTime()) / smylib.howMs.inDay;

    if (diff < -2) return date.toLocaleDateString();

    return relativeTimeFormatter.format(diff, 'day');
  };

  return (
    <>
      <StyledMessagePlace
        class={joinKnownClassNames(['full-width'], 'message-place weight-up ' + props.class)}
        message-id={props.message.id}
        sender-id={props.message.sentMemberId}
        message-type={props.message.type}
        reply-to-message={props.message.replyMessageId}
      >
        <ChatMessage message={props.message} />
      </StyledMessagePlace>
      <Show
        when={writtenDateLabel()}
        keyed
      >
        {writtenDateLabel => (
          <StyledNextDayIndicator
            label={writtenDateLabel}
            size="small"
            color="info"
          />
        )}
      </Show>
    </>
  );
};

const markAsAccentMessageAnimation = keyframes`${css`
  from {
    background-color: grey;
  }

  to {
    background-color: transparent;
  }
`}`;

const inTheProcessOfSearchingForAMessageAnimation = keyframes`${css`
  100% {
    transform: translateX(100%);
  }
`}`;

export const StyledMessagePlace = styler('div')(
  ({ theme }) => {
    return {
      [`--${secretChatClassNamesDict.inTheProcessOfSearchingForAMessage}` as never]: theme.palette.success.dark,
    };
  },
  {
    [`--reply-swipe-progress` as never]: 0,

    position: 'relative',
    maxWidth: 'var(--stock-width)',
    padding: '4px',

    [`&.${secretChatClassNamesDict.markAsAccent}`]: {
      animation: `${markAsAccentMessageAnimation} 3s linear`,
    },

    [`&.${secretChatClassNamesDict.inTheProcessOfSearchingForAMessage}`]: {
      '.message-head .info': {
        display: 'inline-block',
        position: 'relative',
        overflow: 'hidden',

        '&::after': {
          content: '""',
          position: 'absolute',
          top: '0',
          right: '0',
          bottom: '0',
          left: '0',
          height: '100%',
          animation: `${inTheProcessOfSearchingForAMessageAnimation} 5s infinite`,
          animationDelay: '1s',
          transform: 'translateX(-100%)',
          backgroundImage: `linear-gradient(
            90deg,
            rgb(from var(--${secretChatClassNamesDict.inTheProcessOfSearchingForAMessage}) r g b / 0) 0,
            rgb(from var(--${secretChatClassNamesDict.inTheProcessOfSearchingForAMessage}) r g b / .3) 20%,
            rgb(from var(--${secretChatClassNamesDict.inTheProcessOfSearchingForAMessage}) r g b / .3) 60%,
            rgb(from var(--${secretChatClassNamesDict.inTheProcessOfSearchingForAMessage}) r g b / 0)
          )`,
        },
      },
    },
  },
);

const StyledNextDayIndicator = styler(Chip)({
  textTransform: 'capitalize',
  margin: 'auto',
});
