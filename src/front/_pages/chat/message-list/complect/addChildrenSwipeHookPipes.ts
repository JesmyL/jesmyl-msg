import { addEventListenerPipe } from '../../../../utils/hookEffectPipe';

export const lastReadClassName = 'last-read-message';
export const incomingMessageClassName = 'incoming-message';
export const outgoingMessageClassName = 'outgoing-message';

const slideLimit = 40;
type PointsEvent = { screenX: number; screenY: number };

enum ActionType {
  None = '',
  TouchBackward = 'backward',
  TouchForward = 'forward',
  VerticalScrolling = 'scroll',
  RejectAll = 'rejectAll',
}

export const addChildrenSwipeHookPipes = <ChildElement extends HTMLElement>(
  listNode: ChildElement,
  childClassName: string,
  onAction: (
    phase: 'progress' | 'progressEnd' | 'context' | 'dblclick',
    childNode: ChildElement,
    progress: number,
  ) => void,
) => {
  const setMessageNode = (event: { target: unknown }) => {
    let targetNode = event.target as ChildElement | null;

    while (targetNode) {
      if (targetNode == null || targetNode.classList.contains(childClassName)) break;
      targetNode = targetNode.parentElement as ChildElement;
    }

    return targetNode;
  };

  let actionType = ActionType.None;
  let startScreenX = 0;
  let startScreenY = 0;
  let childNode: ChildElement | null = null;

  const setStartPoints = (event: PointsEvent) => {
    startScreenX = event.screenX;
    startScreenY = event.screenY;
  };

  const setActionType = (event: PointsEvent) => {
    actionType =
      Math.abs(event.screenY - startScreenY) > 5
        ? ActionType.VerticalScrolling
        : event.screenX - startScreenX > 5
          ? ActionType.TouchBackward
          : event.screenX - startScreenX < 5
            ? ActionType.TouchForward
            : ActionType.None;
  };

  let isDetectedOverLimit = false;
  let progress = 0;
  let contextMenuTimeout: TimeOut;

  return [
    addEventListenerPipe(listNode, 'touchstart', event => {
      const node = (childNode = setMessageNode(event));
      setStartPoints(event.targetTouches[0]);

      if (node)
        contextMenuTimeout = setTimeout(() => {
          if (actionType !== ActionType.None) return;
          actionType = ActionType.RejectAll;
          onAction('context', node, 0);
        }, 500);
    }),
    addEventListenerPipe(listNode, 'contextmenu', event => {
      event.preventDefault();
      const node = setMessageNode(event);
      if (node) onAction('context', node, 0);
    }),
    addEventListenerPipe(listNode, 'dblclick', event => {
      event.preventDefault();
      const node = setMessageNode(event);
      if (node) onAction('dblclick', node, 0);
    }),
    addEventListenerPipe(listNode, 'touchmove', event => {
      if (childNode === null || actionType === ActionType.VerticalScrolling || actionType === ActionType.RejectAll)
        return;
      if (actionType === ActionType.None) setActionType(event.targetTouches[0]);

      const delta = event.targetTouches[0].screenX - startScreenX;

      if (actionType === ActionType.TouchForward) {
        if (delta > 0) {
          event.stopPropagation();
          event.preventDefault();

          if (isDetectedOverLimit) return;
          childNode.style.left = '0px';
          progress = 0;
          onAction('progress', childNode, 0);

          isDetectedOverLimit = true;

          return;
        }

        isDetectedOverLimit = false;

        if (delta < -slideLimit) {
          childNode.style.left = `${-slideLimit}px`;
          progress = 1;
          onAction('progress', childNode, 1);

          return;
        }

        childNode.style.left = `${delta}px`;
        progress = -delta / slideLimit;
        onAction('progress', childNode, progress);

        return;
      }
    }),
    addEventListenerPipe(listNode, 'touchend', () => {
      actionType = ActionType.None;

      if (childNode === null) return;

      childNode.style.left = '0px';
      onAction('progressEnd', childNode, progress);
      clearTimeout(contextMenuTimeout);
    }),
    addEventListenerPipe(listNode, 'scroll', event => {
      if (
        actionType === ActionType.RejectAll ||
        actionType === ActionType.TouchBackward ||
        actionType === ActionType.TouchForward
      )
        return;

      event.stopPropagation();
      event.preventDefault();
    }),
  ];
};
