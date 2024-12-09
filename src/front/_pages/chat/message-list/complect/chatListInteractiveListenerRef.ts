import { Accessor, onCleanup } from 'solid-js';
import { ItChat } from '../../../../../shared/api/complect/chat';
import { complectIDB } from '../../../../_idb/complect.idb';
import { getParentNodeWithClassName } from '../../../../utils/getParentNodeWithClassName';
import { addEventListenerPipe, hookEffectPipe } from '../../../../utils/hookEffectPipe';
import { useChatMessageTsOnActionsContext } from '../../Contexts';
import { addChildrenSwipeHookPipes } from './addChildrenSwipeHookPipes';
import { useScrollIntoViewAccentMessageCallback } from './useScrollIntoViewAccentMessageCallback';

export const chatListInteractiveListenerRef = (
  listNode: HTMLDivElement,
  chat: ItChat.ChatMiniInfo,
  replyFloatIconBoxRef: Accessor<HTMLDivElement | null>,
  replyFloatIconBoxPlaceRef: Accessor<HTMLDivElement | null>,
) => {
  const setMessageTsOnActions = useChatMessageTsOnActionsContext();
  let isReplyFloatIconInMessage = false;
  const scrollToAccentMessage = useScrollIntoViewAccentMessageCallback();

  onCleanup(
    hookEffectPipe()
      .pipe(
        ...addChildrenSwipeHookPipes<HTMLDivElement>(listNode, 'message-place', (action, messageNode, progress) => {
          if (action === 'context') {
            const messageIdStr = messageNode.getAttribute('message-id');
            if (messageIdStr) setMessageTsOnActions(+messageIdStr);
            return;
          }

          const reply = () => {
            const messageIdStr = messageNode.getAttribute('message-id');

            if (messageIdStr)
              complectIDB.db.drafts.update(chat.id, {
                editId: undefined,
                replyId: +messageIdStr,
                prevSimpleMessageText: '',
              });
          };

          if (action === 'dblclick') reply();

          messageNode.style.setProperty('--reply-swipe-progress', '' + progress);

          const replyFloatIconBoxNode = replyFloatIconBoxRef();
          if (replyFloatIconBoxNode === null) return;

          if (action === 'progressEnd') {
            replyFloatIconBoxPlaceRef()?.appendChild(replyFloatIconBoxNode);
            isReplyFloatIconInMessage = false;
            if (progress > 0.9) reply();
          } else if (action === 'progress') {
            if (isReplyFloatIconInMessage) return;
            isReplyFloatIconInMessage = true;

            (messageNode as HTMLElement)?.appendChild(replyFloatIconBoxNode);
          }
        }),
        addEventListenerPipe(listNode, 'click', async event => {
          const { foundClassNames, node } = getParentNodeWithClassName(event, 'message-place', ['message-head']);

          if (node === null || !foundClassNames['message-head']) return;

          event.stopPropagation();
          event.preventDefault();

          const messageIdStr = node.getAttribute('message-id');

          if (messageIdStr === null) return;

          const currentMessage = await complectIDB.db.messages.where('id').equals(+messageIdStr).first();

          if (currentMessage?.replyMessageId == null) return;

          scrollToAccentMessage(currentMessage.replyMessageId);
        }),
      )
      .effect(),
  );
};
