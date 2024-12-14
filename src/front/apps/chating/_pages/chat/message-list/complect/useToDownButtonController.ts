import { onCleanup } from 'solid-js';
import { addEventListenerPipe, hookEffectPipe } from '../../../../../../utils/hookEffectPipe';
import { RefValue } from '../../../../../../utils/useRef';
import { chatingIDB } from '../../../../_idb/chating.idb';
import { useChatContext, useGoToBottomMessageContext } from '../../Contexts';

export const useToDownButtonController = (
  listNode: HTMLDivElement,
  toDownButtonRef: RefValue<HTMLDivElement | null>,
) => {
  const toDownButtonNode = toDownButtonRef();
  let checkIsCanShowToDownButton = () => {};
  const goToBottom = useGoToBottomMessageContext();
  const chat = useChatContext();
  const updateChatDetails = chatingIDB.useUpdateChatDetails(chat.id);

  if (toDownButtonNode) {
    let isShowToDownButtonTurn = false;

    checkIsCanShowToDownButton = async () => {
      if (listNode.scrollTop < -20) {
        if (!isShowToDownButtonTurn) {
          isShowToDownButtonTurn = true;
          toDownButtonNode.classList.add('show');
        }
      } else if (isShowToDownButtonTurn) {
        isShowToDownButtonTurn = false;
        toDownButtonNode.classList.remove('show');

        const lastMessage = await chatingIDB.db.messages.where({ chatid: chat.id }).last();
        const messageNode = lastMessage && listNode.querySelector(`[message-id="${lastMessage.id}"]`);

        if (messageNode)
          updateChatDetails({
            alternativeAccentMessageId: undefined,
            accentMessageId: undefined,
          });
      }
    };

    setTimeout(checkIsCanShowToDownButton, 100);

    onCleanup(
      hookEffectPipe()
        .pipe(
          addEventListenerPipe(toDownButtonNode, 'click', () => {
            toDownButtonNode.classList.remove('show');

            goToBottom();
          }),
        )
        .effect(),
    );
  }

  onCleanup(
    hookEffectPipe()
      .pipe(
        addEventListenerPipe(listNode, 'scroll', () => {
          checkIsCanShowToDownButton();
        }),
      )
      .effect(),
  );
};
