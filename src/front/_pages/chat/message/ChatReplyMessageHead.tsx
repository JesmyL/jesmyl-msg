import { createDexieSignalQuery } from 'solid-dexie';
import { Show } from 'solid-js';
import { ItChat } from '../../../../shared/api/complect/chat';
import { complectIDB } from '../../../_idb/complect.idb';
import { css, keyframes, styler } from '../../../css';
import { knownUtilTypographyClassNames } from '../../../styles/known-class-names';
import { useChatContext } from '../Contexts';

const HeadIfExists = (props: { targetMessage: ItChat.ImportableMessage }) => {
  const chat = useChatContext();
  const sender = () => {
    return chat.members.find(member => member.id === props.targetMessage.sentMemberId);
  };

  return (
    <StyledMessageHead
      class="message-head"
      ownerState={{ isRemoved: props.targetMessage.isRemoved }}
    >
      <div class="vertical-border" />
      <div class="image" />
      <div class="info">
        <div class="title">{sender()?.user.fio}</div>
        <div class="text">{props.targetMessage.text}</div>
      </div>
    </StyledMessageHead>
  );
};

export const ChatReplyMessageHead = (props: {
  message: ItChat.ImportableMessage;
  replyMessageId: ItChat.MessageId;
}) => {
  const targetMessage = createDexieSignalQuery(() =>
    complectIDB.db.messages.where('id').equals(props.replyMessageId).first(),
  );

  return <Show when={targetMessage()}>{targetMessage => <HeadIfExists targetMessage={targetMessage()} />}</Show>;
};

const scaleInAnimation = keyframes`${css`
  from {
    scale: 0;
  }
  to {
    scale: 1;
  }
`}`;

const StyledMessageHead = styler('div')<{ isRemoved: boolean | und }>(({ theme, ownerState }) => ({
  '--border-accent-width': theme.spacing(0.5),
  '--info-margin-left': '10px',

  ...knownUtilTypographyClassNames.pointer,
  position: 'relative',
  display: 'flex',
  borderRadius: 'var(--border-accent-width)',
  backgroundColor: `${theme.palette.success.dark}77`,
  overflow: 'hidden',
  transformOrigin: 'right',
  animation: `${scaleInAnimation} .3s linear`,
  float: 'right',

  transition: '.2s linear',
  transitionProperty: 'scale, max-height, max-width',

  maxWidth: '100%',
  maxHeight: '5em',

  ...(ownerState.isRemoved ? { maxHeight: '0', maxWidth: '0', scale: '0' } : null),

  '.vertical-border': {
    position: 'absolute',
    left: '0',
    top: '0',
    width: 'var(--border-accent-width)',
    height: '100%',
    backgroundColor: theme.palette.success.light,
  },

  '.title, .text': {
    ...knownUtilTypographyClassNames.ellipsis,
    display: 'block',
    fontSize: '0.8em',
    lineHeight: '1em',
    maxWidth: '100%',
    width: 'max-content',
  },

  '.title': {
    fontWeight: 'bold',
  },

  '.info': {
    margin: '5px 0 5px var(--info-margin-left)',
    maxWidth: 'calc(100% - var(--info-margin-left))',
  },
}));
