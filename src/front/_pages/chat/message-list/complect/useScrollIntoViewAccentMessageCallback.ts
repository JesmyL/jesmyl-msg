import { ItChat } from '../../../../../shared/api/complect/chat';
import { secretChatClassNamesDict } from '../../ChatPage.styled';
import { useChatContext, useChatMessagesContext } from '../../Contexts';

let markAsAccentClickTimeoutDict: Partial<Record<ItChat.MessageId, TimeOut>> = {};

export const useScrollIntoViewAccentMessageCallback = () =>
  // limits: ListSlicerLimits,
  // setLimits: (start: number | nil, finish: number | nil) => void,
  // loadMessagesNearId: (messageId: ItChat.MessageId, scrollToMessage: (messageId?: ItChat.MessageId) => void) => void,
  {
    const chatMessages = useChatMessagesContext();
    const chat = useChatContext();
    // const alternativeMessagesHashMap = useChatAlternativeMessagesHashMapValue(chatId);
    // const [isAlternativeList, setIsAlternativeList] = useAtom(secretChatsIsAlternativeMessageHashMapAtom);

    return (messageId: ItChat.MessageId) => {
      const findNode = () => document.querySelector(`[message-id='${messageId}']`);
      let targetMessageNode = findNode();
      const targetMessageIdi = chatMessages.findIndex(message => message.id === messageId);

      const makeAccent = (id = messageId) => {
        targetMessageNode ??= findNode();
        if (targetMessageNode === null) return;

        targetMessageNode.scrollIntoView({ block: 'center' });

        targetMessageNode.classList.add(secretChatClassNamesDict.markAsAccent);

        clearTimeout(markAsAccentClickTimeoutDict[messageId]);

        if (targetMessageNode.classList.contains(secretChatClassNamesDict.markAsAccent)) {
          targetMessageNode?.classList.remove(secretChatClassNamesDict.markAsAccent);
          setTimeout(() => {
            targetMessageNode?.classList.add(secretChatClassNamesDict.markAsAccent);
          }, 50);
        }
      };

      if (targetMessageNode === null) {
        // console.log(targetMessageIdi, alternativeMessagesHashMap, messageId);
        if (targetMessageIdi < 0) {
          // if (alternativeMessagesHashMap?.[messageId]) {
          //   if (isAlternativeList[chatId]) loadMessagesNearIdRef.current(messageId, makeAccent);
          //   else {
          //     setIsAlternativeList(prev => ({ ...prev, [chatId]: true }));
          //     setTimeout(makeAccent, 500);
          //   }
          // } else loadMessagesNearIdRef.current(messageId, makeAccent);
          return;
        }

        // setLimits(targetMessageIdi - 20, targetMessageIdi + 20);
        setTimeout(makeAccent, 500);

        return;
      }

      // const startLimit = targetMessageIdi - limits.start < 30 ? targetMessageIdi - 30 : null;
      // const finishLimit = limits.finish - targetMessageIdi < 30 ? targetMessageIdi + 30 : null;

      // setLimits(startLimit, finishLimit);

      setTimeout(makeAccent, 100);
    };
  };
