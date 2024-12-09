import { Accessor, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';

export const useListInfiniteScrollController = <Item>(
  listRef: HTMLDivElement,
  list: Item[],
  childClassName: string,
  findCurrentIndex: (item: Item, index: number, items: Item[]) => boolean,
  onScrollToLimit?: (isStart: boolean) => void,
  initItemsBefore = 15,
  initItemsAfter = 20,
  loadItemsOnScroll = 30,
): ListSlicerLimitsControls => {
  const [isInit, setIsInit] = createSignal(true);

  const [limits, setLimits] = createStore(() => {
    let itemi = list.findIndex(findCurrentIndex);
    itemi = itemi < 0 ? 0 : itemi;

    const startLimitPlus = initItemsAfter - (list.length - itemi);
    const finishLimitPlus = initItemsBefore - itemi;

    const initialStartLimit = itemi - initItemsBefore - (startLimitPlus > 0 ? startLimitPlus : 0);
    const initialFinishLimit = itemi + initItemsAfter + (finishLimitPlus > 0 ? finishLimitPlus : 0);

    const start = initialStartLimit < 0 ? 0 : initialStartLimit;
    const finish = initialFinishLimit + 1;

    return { start, finish };
  });

  const updateLimits = (start: number | nil, finish: number | nil) => {
    if (start == null && finish == null) return;

    setLimits({
      start: start == null ? limits().start : start < 0 ? 0 : start,
      finish: finish ?? limits().finish,
    });
  };

  onMount(() => {
    if (isInit()) {
      setTimeout(setIsInit, 1000, false);
      return;
    }

    if (listRef === null) return;
    listRef.classList.add(listNodeQuerySelectorClassName);

    const lastObserverCallback: IntersectionObserverCallback = ([entry], observer) => {
      if (!entry.isIntersecting) return;

      // (entry.target as HTMLDivElement).style.background = 'yellow';

      if (limits().finish >= list.length) {
        observer.disconnect();
        onScrollToLimit?.(false);
      } else updateLimits(null, limits().finish + loadItemsOnScroll);
    };

    const firstObserverCallback: IntersectionObserverCallback = ([entry], observer) => {
      if (!entry.isIntersecting) return;

      // (entry.target as HTMLDivElement).style.background = 'green';

      if (limits().start === 0) {
        observer.disconnect();
        onScrollToLimit?.(true);
      } else updateLimits(limits().start - loadItemsOnScroll, null);
    };

    const firstObserveNode = document.querySelector(firstObserveQuerySelector) as HTMLDivElement | null;

    const firstNode = document.querySelector(
      `.${listNodeQuerySelectorClassName} .${childClassName}:is(:nth-child(1),:nth-child(2))`,
    ) as HTMLDivElement | null;

    const firstOnserveNodeIntersection = new IntersectionObserver(firstObserverCallback, intersectionOptions);
    const firstNodeIntersection = new IntersectionObserver(firstObserverCallback, intersectionOptions);

    if (firstObserveNode) firstOnserveNodeIntersection.observe(firstObserveNode);
    if (firstNode && firstObserveNode !== firstNode) firstNodeIntersection.observe(firstNode);

    const lastObserveNodeIntersection = new IntersectionObserver(lastObserverCallback, intersectionOptions);
    const lastNodeIntersection = new IntersectionObserver(lastObserverCallback, intersectionOptions);

    const lastObserveNode = document.querySelector(lastObserveQuerySelector) as HTMLDivElement | null;

    const lastNode = document.querySelector(
      `.${listNodeQuerySelectorClassName} .${childClassName}:is(:nth-last-of-type(1),:nth-last-of-type(2))`,
    ) as HTMLDivElement | null;

    if (lastObserveNode && lastObserveNode !== firstObserveNode && lastObserveNode !== firstNode)
      lastObserveNodeIntersection.observe(lastObserveNode);

    if (lastNode && lastObserveNode !== lastNode && lastNode !== firstObserveNode && lastNode !== firstNode)
      lastNodeIntersection.observe(lastNode);

    return () => {
      firstOnserveNodeIntersection.disconnect();
      firstNodeIntersection.disconnect();

      lastNodeIntersection.disconnect();
      lastObserveNodeIntersection.disconnect();

      listRef.classList.remove(listNodeQuerySelectorClassName);
    };
  });

  return {
    limits,
    updateLimits,
  };
};

export type ListSlicerLimits = {
  start: number;
  finish: number;
};

const intersectionOptions: IntersectionObserverInit = {};

export type ListSlicerLimitsControls = {
  limits: Accessor<ListSlicerLimits>;
  updateLimits: (start: number | nil, finish: number | nil) => void;
};

const listNodeQuerySelectorClassName = 'the-list-for-infinite-scroll-control';
const pointers = [30, 25, 20, 15, 10, 5];

const firstObserveQuerySelector = `.${listNodeQuerySelectorClassName} > :is(${pointers
  .map(nth => `*:nth-child(${nth})`)
  .join(',')})`;
const lastObserveQuerySelector = `.${listNodeQuerySelectorClassName} > :is(${pointers
  .map(nth => `*:nth-last-child(${nth})`)
  .join(',')})`;
