import { ItChat } from '../../../shared/api/complect/chat';
import { emptyFunc } from '../../../shared/utils';
import { contextCreator } from '../../utils/contextCreator';

export const [ChatContext, useChatContext] = contextCreator(null as never as ItChat.ChatMiniInfo);

export const [ChatMessagesContext, useChatMessagesContext] = contextCreator(
  null as never as ItChat.ImportableMessage[],
);

export const [ChatMessageTsOnActionsContext, useChatMessageTsOnActionsContext] = contextCreator(
  (_messageId: ItChat.MessageId | null) => {},
);

export const [MessageListLimitsContext, useMessageListLimitsContext] = contextCreator({ from: 0, to: 20 });
export const [MessageListLimitsSetterContext, useMessageListLimitsSetterContext] =
  contextCreator<(set: (limits: { from: number; to: number }) => void) => void>(emptyFunc);
