import { createDexieArrayQuery } from 'solid-dexie';
import { JSX } from 'solid-js';
import { createStore } from 'solid-js/store';
import { ItChat } from '../../../../../shared/api/complect/chat';
import { smylib } from '../../../../../shared/utils';
import { useRef } from '../../../../utils/useRef';
import { chatingIDB } from '../../_idb/chating.idb';
import {
  ChatContext,
  ChatMessagesContext,
  defaultMessageListLimits,
  GoToBottomMessageContext,
  MessageListLimits,
  MessageListLimitsUpdateContext,
  MessagesListRefContext,
} from './Contexts';

export const ChatPageContextControlsWrappers = (props: { chat: ItChat.ChatMiniInfo; children: JSX.Element }) => {
  const listRef = useRef<HTMLDivElement | null>(null);

  const chatDetails = chatingIDB.useChatDetails(props.chat.id);
  const updateChatDetails = chatingIDB.useUpdateChatDetails(props.chat.id);

  const [limits, setLimits] = createStore(defaultMessageListLimits());

  const filterInremovedMessages = (message: ItChat.ImportableMessage) => message.isRemoved !== true;

  const getMessageListWithAccent = async (messagesListKey: 'messages' | 'alternativeMessages') => {
    const chatid = props.chat.id;
    const accentAfter = limits.accentAfter;
    const accentBefore = limits.accentBefore;
    const accentMessageId = chatDetails().accentMessageId ?? chatDetails().alternativeAccentMessageId;

    if (accentMessageId == null) return [];

    const messages = [
      ...(
        await chatingIDB.db[messagesListKey]
          .where({ chatid })
          .and(message => filterInremovedMessages(message) && message.id < accentMessageId)
          .reverse()
          .limit(accentBefore)
          .toArray()
      ).reverse(),

      ...(await chatingIDB.db[messagesListKey]
        .where({ chatid })
        .and(message => filterInremovedMessages(message) && message.id >= accentMessageId)
        .limit(accentAfter)
        .toArray()),
    ].reverse();

    return messages;
  };

  const currentMessages = createDexieArrayQuery(async () => {
    const chatid = props.chat.id;
    const accentMessageId = chatDetails().accentMessageId;

    if (accentMessageId === undefined)
      return chatingIDB.db.messages
        .where({ chatid })
        .and(filterInremovedMessages)
        .offset(limits.from)
        .limit(limits.from + limits.to)
        .reverse()
        .toArray();

    return getMessageListWithAccent('messages');
  });

  const alternativeMessages = createDexieArrayQuery(() => {
    return getMessageListWithAccent('alternativeMessages');
  });

  const messages = () => {
    const currentMessagesList = currentMessages;
    return alternativeMessages.length ? alternativeMessages : currentMessagesList;
  };

  const updateLimits = (set: MessageListLimits | ((limits: MessageListLimits) => MessageListLimits)) => {
    if (smylib.isFunc(set)) {
      const val = set(limits);

      if (val.from < 0) {
        setLimits({ ...val, from: 0 });
        return;
      }

      setLimits(val);
    } else setLimits(set);
  };

  const slideToBottom = (isRejectSmoothBehavior?: boolean) => {
    const listNode = listRef();

    if (listNode === null) return;

    if (isRejectSmoothBehavior) {
      listNode.scrollTop = 0;
      return;
    }

    if (listNode.scrollTop < -listNode.clientHeight) listNode.scrollTop = -listNode.clientHeight;
    listNode.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goToBottomMessage = (isRejectSmoothBehavior?: boolean) => {
    const accentMessageId = chatDetails().accentMessageId;
    const alternativeAccentMessageId = chatDetails().alternativeAccentMessageId;

    if (accentMessageId != null || alternativeAccentMessageId != null || limits.from > 1) {
      updateChatDetails({
        alternativeAccentMessageId: undefined,
        accentMessageId: undefined,
      });
      updateLimits(defaultMessageListLimits());

      setTimeout(slideToBottom, 300, isRejectSmoothBehavior);
    } else slideToBottom(isRejectSmoothBehavior);
  };

  return (
    <ChatMessagesContext.Provider value={messages()}>
      <MessageListLimitsUpdateContext.Provider value={updateLimits}>
        <MessagesListRefContext.Provider value={listRef}>
          <GoToBottomMessageContext.Provider value={goToBottomMessage}>
            <ChatContext.Provider value={props.chat}>{props.children}</ChatContext.Provider>
          </GoToBottomMessageContext.Provider>
        </MessagesListRefContext.Provider>
      </MessageListLimitsUpdateContext.Provider>
    </ChatMessagesContext.Provider>
  );
};
