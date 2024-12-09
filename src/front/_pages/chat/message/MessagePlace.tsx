import { Chip } from '@suid/material';
import { Show } from 'solid-js';
import { ItChat } from '../../../../shared/api/complect/chat';
import { smylib } from '../../../../shared/utils';
import { css, keyframes, styler } from '../../../css';
import { joinKnownClassNames } from '../../../styles/known-class-names';
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
    const nextDayDate = new Date(nextDate);

    todayDate.setHours(0, 0, 0, 0);
    nextDayDate.setHours(0, 0, 0, 0);

    const diff = (nextDayDate.getTime() - todayDate.getTime()) / smylib.howMs.inDay + 1;

    if (diff < -1) return date.toLocaleDateString();

    return relativeTimeFormatter.format(diff + 1, 'day');
  };

  return (
    <>
      <StyledMessagePlace
        class={joinKnownClassNames(['full-width'], 'message-place weight-up ' + props.class)}
        message-id={props.message.id}
        sender-id={props.message.sentMemberId}
        message-type={props.message.type}
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

export const StyledMessagePlace = styler('div')({
  [`--reply-swipe-progress` as never]: 0,

  position: 'relative',
  maxWidth: 'var(--stock-width)',
  padding: '4px',

  [`&.${secretChatClassNamesDict.markAsAccent}`]: {
    animation: `${markAsAccentMessageAnimation} 3s linear`,
  },
});

const StyledNextDayIndicator = styler(Chip)({
  textTransform: 'capitalize',
  margin: 'auto',
});
