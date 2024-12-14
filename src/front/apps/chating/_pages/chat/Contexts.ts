import { ItChat } from '../../../../../shared/api/complect/chat';
import { emptyFunc, EventerListenScope, retNull } from '../../../../../shared/utils';
import { contextCreator } from '../../../../utils/contextCreator';
import { RefValue } from '../../../../utils/useRef';

export const [ChatContext, useChatContext] = contextCreator(null as never as ItChat.ChatMiniInfo);

export const [ChatMessagesContext, useChatMessagesContext] = contextCreator(
  null as never as ItChat.ImportableMessage[],
);

export const [ChatMessageTsOnActionsContext, useChatMessageTsOnActionsContext] =
  contextCreator<(messageId: ItChat.MessageId | null) => void>(emptyFunc);

export const [GoToBottomMessageContext, useGoToBottomMessageContext] =
  contextCreator<(isRejectSmoothBehavior?: boolean) => void>(emptyFunc);

export const [ChatMessagesReadingPauseListenersContext, useChatMessagesReadingPauseListenersContext] =
  contextCreator<EventerListenScope>(null!);

export const [MessagesListRefContext, useMessagesListRefContext] =
  contextCreator<RefValue<HTMLDivElement | null>>(retNull);

export type MessageListLimits = {
  accentBefore: number;
  accentAfter: number;
  from: number;
  to: number;
};

export const defaultMessageListLimits = (): MessageListLimits => ({
  accentBefore: 30,
  accentAfter: 30,
  from: 0,
  to: 20,
});

export const [MessageListLimitsContext, useMessageListLimitsContext] = contextCreator(defaultMessageListLimits());
export const [MessageListLimitsUpdateContext, useMessageListLimitsUpdateContext] =
  contextCreator<(set: ((limits: MessageListLimits) => MessageListLimits) | MessageListLimits) => void>(emptyFunc);
