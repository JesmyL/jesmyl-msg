import { createDexieArrayQuery } from 'solid-dexie';
import { Show } from 'solid-js';
import { ItChat } from '../../../../../../shared/api/complect/chat';
import { styler } from '../../../../../css';
import { knownUtilTypographyClassNames } from '../../../../../styles/known-class-names';
import { chatingIDB } from '../../../_idb/chating.idb';
import { useChatMessageTsOnActionsContext } from '../Contexts';
import { ContextMenuOfMessage } from './ContextMenuOfMessage';
import { ChatMessage } from './Message';

export const ContextedMessage = (props: { messageId: ItChat.MessageId }) => {
  const messages = createDexieArrayQuery(() => chatingIDB.db.messages.where('id').equals(props.messageId).toArray());

  return <Show when={messages[0]}>{message => <ShownMessage message={message()} />}</Show>;
};

const ShownMessage = (props: { message: ItChat.ImportableMessage }) => {
  const setMessageTsOnActions = useChatMessageTsOnActionsContext();

  return (
    <StyledMessageBackdrop onClick={() => setMessageTsOnActions(null)}>
      <StyledChatMessageBox>
        <ChatMessage message={props.message} />
      </StyledChatMessageBox>
      <ContextMenuOfMessage message={props.message} />
    </StyledMessageBackdrop>
  );
};

const StyledChatMessageBox = styler('div')({
  ...knownUtilTypographyClassNames.absolute,
  ...knownUtilTypographyClassNames['flex-center'],
  ...knownUtilTypographyClassNames['full-width'],
  ...knownUtilTypographyClassNames['margin-gap-b'],
  bottom: '50%',
});

const StyledMessageBackdrop = styler('div')(
  {
    ...knownUtilTypographyClassNames.absolute,
    ...knownUtilTypographyClassNames['full-fill'],
    backgroundColor: '#555d',
  },
  ({ theme }) => ({ zIndex: theme.zIndex.modal }),
);
