import { ItChat } from '../../../../../../../shared/api/complect/chat';
import { chatingIDB } from '../../../../_idb/chating.idb';
import { secretChatClassNamesDict } from '../../ChatPage.styled';
import { useChatMessagesContext, useChatMessagesReadingPauseListenersContext } from '../../Contexts';

export const useScrollIntoViewAccentMessageCallback = (
  loadMessagesNearId: (
    message: ItChat.ImportableMessage | null,
    messageId: ItChat.MessageId,
    scrollToMessage: () => void,
  ) => void,
) => {
  const chatVisibleBatchMessages = useChatMessagesContext();

  const messagesReadingPauseListenerScope = useChatMessagesReadingPauseListenersContext();

  return (messageId: ItChat.MessageId, onMessageFound: () => void) => {
    const findNode = () => document.querySelector(`[message-id='${messageId}']`);
    const targetMessageNode = findNode();
    let isMessagesFetched = false;
    // let accentOnMessagesFetched = () => {
    //   isMessagesFetched = true;
    // };

    const makeAccent = () => {
      let makeAccentRecurcyCount = 10;

      const scrollToMessage = () => {
        const targetMessageNode = findNode();

        if (targetMessageNode === null) {
          if (makeAccentRecurcyCount-- > 0) setTimeout(scrollToMessage, 100);
          return;
        }

        onMessageFound();

        targetMessageNode.scrollIntoView({ block: 'center' });

        if (targetMessageNode.classList.contains(secretChatClassNamesDict.markAsAccent)) {
          targetMessageNode.classList.remove(secretChatClassNamesDict.markAsAccent);

          setTimeout(() => {
            targetMessageNode?.classList.add(secretChatClassNamesDict.markAsAccent);
          }, 50);
        } else targetMessageNode.classList.add(secretChatClassNamesDict.markAsAccent);
      };

      messagesReadingPauseListenerScope.listenFirst(scrollToMessage);
    };

    if (targetMessageNode === null) {
      if (chatVisibleBatchMessages.some(message => message.id === messageId)) {
        makeAccent();
        return;
      }

      (async () => {
        const dbMessage = await chatingIDB.db.messages.get({ id: messageId });

        console.log(dbMessage);

        if (dbMessage === undefined) {
          loadMessagesNearId(null, messageId, makeAccent);
          return;
        }

        loadMessagesNearId(dbMessage, messageId, makeAccent);
      })();

      return;
    }

    makeAccent();
  };
};
