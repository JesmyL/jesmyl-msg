import { onCleanup } from 'solid-js';
import { addEventListenerPipe, hookEffectPipe } from '../../../../utils/hookEffectPipe';
import { RefValue } from '../../../../utils/useRef';

export const useToDownButtonController = (
  listNode: HTMLDivElement,
  toDownButtonRef: RefValue<HTMLDivElement | null>,
) => {
  const toDownButtonNode = toDownButtonRef();
  let checkIsCanShowToDownButton = () => {};

  if (toDownButtonNode) {
    let isShowToDownButtonTurn = false;

    checkIsCanShowToDownButton = () => {
      if (listNode.scrollTop < -20) {
        if (!isShowToDownButtonTurn) {
          isShowToDownButtonTurn = true;
          toDownButtonNode.classList.add('show');
        }
      } else if (isShowToDownButtonTurn) {
        isShowToDownButtonTurn = false;
        toDownButtonNode.classList.remove('show');
      }
    };

    setTimeout(checkIsCanShowToDownButton, 100);

    onCleanup(
      hookEffectPipe()
        .pipe(
          addEventListenerPipe(toDownButtonNode, 'click', () => {
            toDownButtonNode.classList.remove('show');
            if (listNode.scrollTop < -listNode.clientHeight) listNode.scrollTop = -listNode.clientHeight;
            listNode.children[0]?.scrollIntoView({ block: 'end', behavior: 'smooth' });
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
