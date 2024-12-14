import { onCleanup } from 'solid-js';
import { Eventer } from '../../../../../../../shared/utils';
import { addEventListenerPipe, hookEffectPipe } from '../../../../../../utils/hookEffectPipe';

export const useOnScrolledToLimitEventer = (listNode: HTMLDivElement) => {
  let prevIsTopBorder = false;
  let prevIsBottomBorder = true;
  let isTopBorder = false;
  let isBottomBorder = false;

  const eventerScope = Eventer.createValue<boolean>();

  onCleanup(
    hookEffectPipe()
      .pipe(
        addEventListenerPipe(listNode, 'scroll', () => {
          isTopBorder =
            listNode.scrollHeight - -listNode.scrollTop < listNode.clientHeight * 2 ||
            listNode.scrollHeight - -listNode.scrollTop < listNode.clientHeight * 0.2;
          isBottomBorder =
            -listNode.scrollTop < listNode.clientHeight || -listNode.scrollTop < listNode.clientHeight * 0.2;

          if (!prevIsTopBorder && isTopBorder) eventerScope.invoke(false);
          if (!prevIsBottomBorder && isBottomBorder) eventerScope.invoke(true);

          prevIsTopBorder = isTopBorder;
          prevIsBottomBorder = isBottomBorder;
        }),
      )
      .effect(),
  );

  return eventerScope;
};
