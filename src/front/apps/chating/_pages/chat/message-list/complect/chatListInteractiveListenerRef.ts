import { Accessor, onCleanup } from 'solid-js';
import { ItChat } from '../../../../../../../shared/api/complect/chat';
import { sokim } from '../../../../../../soki/soki';
import { getParentNodeWithClassName } from '../../../../../../utils/getParentNodeWithClassName';
import { addEventListenerPipe, hookEffectPipe } from '../../../../../../utils/hookEffectPipe';
import { chatingIDB } from '../../../../_idb/chating.idb';
import { secretChatClassNamesDict } from '../../ChatPage.styled';
import { useChatMessageTsOnActionsContext, useMessageListLimitsUpdateContext } from '../../Contexts';
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
  const updateLimits = useMessageListLimitsUpdateContext();

  const updateChatDetails = chatingIDB.useUpdateChatDetails(chat.id);

  const scrollToAccentMessage = useScrollIntoViewAccentMessageCallback(async (message, messageId, scrollToMessage) => {
    console.log(message, messageId);

    if (message === null) {
      sokim
        .send({
          chatFetch: {
            chatId: chat.chatId,
            pullAlternativeMessagesNearId: messageId,
          },
        })
        .on(() => {
          updateChatDetails({
            alternativeAccentMessageId: messageId,
            accentMessageId: undefined,
          });
          updateLimits(lims => ({ ...lims, accentBefore: 31, accentAfter: 29 }));
          scrollToMessage();
        });

      return;
    }

    updateChatDetails({
      alternativeAccentMessageId: undefined,
      accentMessageId: messageId,
    });
    updateLimits(lims => ({ ...lims, accentBefore: 30, accentAfter: 30 }));

    scrollToMessage();
  });

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
              chatingIDB.db.drafts.update(chat.id, {
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

          const currentMessage = await chatingIDB.db.messages.get({ id: +messageIdStr });

          if (currentMessage?.replyMessageId == null) return;
          node.classList.add(secretChatClassNamesDict.inTheProcessOfSearchingForAMessage);

          scrollToAccentMessage(currentMessage.replyMessageId, () => {
            node.classList.remove(secretChatClassNamesDict.inTheProcessOfSearchingForAMessage);
          });
        }),
      )
      .effect(),
  );
};
