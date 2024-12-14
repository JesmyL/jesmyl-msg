import { Show } from 'solid-js';
import { ItChat } from '../../../../../../shared/api/complect/chat';
import { styler } from '../../../../../css';
import { joinKnownClassNames } from '../../../../../styles/known-class-names';
import { ChatReplyMessageHead } from './ChatReplyMessageHead';

interface Props {
  class?: string;
  message: ItChat.ImportableMessage;
}

export const ChatMessage = (props: Props) => {
  const date = new Date(props.message.createdAt);

  return (
    <StyledMessage
      class="chat-message"
      sender-id={props.message.sentMemberId}
    >
      <div class={joinKnownClassNames(['ellipsis', 'full-width', 'margin-gap-b'], 'message-title')} />

      <Show when={props.message.replyMessageId}>
        {replyMessageId => (
          <ChatReplyMessageHead
            message={props.message}
            replyMessageId={replyMessageId()}
          />
        )}
      </Show>

      <div class="chat-message-text">{props.message.text}</div>
      <span class="timestamp">
        {props.message.prevText ? 'Изменено ' : null}
        {date.toLocaleString('ru').slice(0, -3)}
      </span>
    </StyledMessage>
  );
};

const StyledMessage = styler('div')({
  position: 'relative',
  width: 'min-content',
  maxWidth: 'var(--max-message-width)',
  minWidth: '140px',
  borderRadius: '7px',
  whiteSpace: 'pre-line',
  wordWrap: 'break-word',
  overflow: 'hidden',

  '.timestamp': {
    display: 'inline-block',
    bottom: '3px',
    right: '10px',
    fontSize: '0.8em',
    opacity: '0.8',
    whiteSpace: 'nowrap',
    textAlign: 'right',
    width: '100%',
    marginTop: '0.5em',
  },
});
