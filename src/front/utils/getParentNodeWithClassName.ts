export const getParentNodeWithClassName = <ClassName extends string>(
  event: { target: unknown },
  stopClassName: string,
  classNamesOnWay?: ClassName[],
) => {
  let node = event.target as HTMLElement | null;
  let classNamesOnWaySet = new Set(classNamesOnWay);
  const foundClassNames = {} as Record<ClassName, true | und>;

  while (node) {
    if (classNamesOnWaySet.size) {
      const nodeClassList = node.classList;

      classNamesOnWaySet.forEach(className => {
        if (nodeClassList.contains(className)) {
          foundClassNames[className] = true;
          classNamesOnWaySet.delete(className);
        }
      });
    }

    if (node.classList.contains(stopClassName)) break;

    node = node.parentElement;
  }

  return { foundClassNames, node };
};
