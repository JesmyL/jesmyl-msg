import { DOMElement } from 'solid-js/jsx-runtime';

type TouchEventHandler<HTMLElement> = (
  event: TouchEvent & {
    currentTarget: HTMLElement;
    target: DOMElement;
  },
) => void;

const maxLim = window.innerWidth;
const minLim = maxLim * 0.2;

const transformOriginBack = -maxLim + 'px center';
const transformOriginForward = maxLim * 2 + 'px center';
const toMaxLeftLimTimeout = 200;
const toActionDoTimeout = 100;
const toInitLeftTimeout = 200;
const transformTransition = 'transform .1s linear';
const initTransition = transformTransition + ', filter .5s linear';
const toInitLeftTransition = initTransition + `, left ${toInitLeftTimeout}ms linear`;

export const backSwipableContainerMaker = (goBack: () => void, goForward?: () => void) => {
  let pageX = 0;
  let pageY = 0;
  let deltaX = 0;
  let isHorizontalMoving: boolean | null = null;
  let isCanGo = true;

  const setTimeOut: (
    callback: (container: HTMLDivElement, ...args: any[]) => void,
    ts: number,
    container: HTMLDivElement,
    ...args: any[]
  ) => TimeOut = setTimeout;
  const isCanGoForward = goForward !== undefined;

  const withInitLeftAction = (container: HTMLDivElement) => {
    isCanGo = true;
    container.style.transition = initTransition;
    container.style.transform = 'scale(1)';
  };

  const withMaxLeftLimAction = (container: HTMLDivElement, transformOrigin: string) => {
    isCanGo = true;
    container.style.transformOrigin = transformOrigin;
    container.style.transition = '';
    container.style.filter = '';
    container.style.left = '0';

    setTimeOut(
      container => {
        container.style.transition = transformTransition;
        container.style.transform = 'scale(1)';
      },
      0,
      container,
    );

    setTimeOut(withInitLeftAction, toInitLeftTimeout, container);
  };

  const onTouchStart: TouchEventHandler<HTMLDivElement> = event => {
    if (event.touches.length === 1) event.stopPropagation();
    pageX = event.touches[0].pageX;
    pageY = event.touches[0].pageY;
    event.currentTarget.style.transition = initTransition;
  };

  const onTouchMove: TouchEventHandler<HTMLDivElement> = event => {
    if (event.touches.length === 1) event.stopPropagation();
    if (!isCanGo) return;
    deltaX = event.touches[0].pageX - pageX;
    if (isHorizontalMoving === null) isHorizontalMoving = deltaX !== 0 && Math.abs(event.touches[0].pageY - pageY) < 5;

    if (Math.abs(deltaX) < minLim) event.currentTarget.style.filter = '';

    if (isHorizontalMoving) {
      if (isCanGoForward || deltaX >= 0) {
        event.currentTarget.style.left = deltaX.toFixed(0) + 'px';
        if (Math.abs(deltaX) > minLim)
          event.currentTarget.style.filter = 'blur(' + (Math.abs(deltaX) / 20).toFixed(0) + 'px)';
      } else if (deltaX < 0) event.currentTarget.style.left = '0';
    }
  };

  const onTouchEnd: TouchEventHandler<HTMLDivElement> = event => {
    if (event.touches.length === 1) event.stopPropagation();

    if (isCanGo && isHorizontalMoving) {
      if (Math.abs(deltaX) < minLim) event.currentTarget.style.filter = '';
      const isForwardDir = deltaX < 0;

      if (!isCanGoForward && isForwardDir) return;
      const container = event.currentTarget;

      if (deltaX > minLim || deltaX < -minLim) {
        container.style.transition = toInitLeftTransition;
        container.style.left = (isForwardDir ? -maxLim : maxLim) + 'px';
        container.style.transform = 'scale(.9)';
        container.style.transformOrigin = '';

        if (isForwardDir) {
          if (isCanGoForward && goForward !== undefined) {
            isCanGo = false;
            setTimeout(goForward, toActionDoTimeout);
          }
        } else {
          isCanGo = false;
          setTimeout(goBack, toActionDoTimeout);
        }

        setTimeOut(
          withMaxLeftLimAction,
          toMaxLeftLimTimeout,
          container,
          isForwardDir ? transformOriginForward : transformOriginBack,
        );
      } else {
        container.style.transition = toInitLeftTransition;
        container.style.left = '0';
        setTimeOut(withInitLeftAction, toInitLeftTimeout, container);
        isCanGo = true;
      }
    }

    pageX = 0;
    isHorizontalMoving = null;
    pageY = 0;
    deltaX = 0;
    isCanGo = true;
  };

  return {
    onTouchMove,
    onTouchStart,
    onTouchEnd,
  };
};
