import * as React from 'react';

export default function useSortTable() {
  const [sortColumn, setSortColumn] = React.useState<number>(-1);
  const [reverseSortingOrder, setReverseSortingOrder] =
    React.useState<boolean>(false);
  const refTable = React.useRef<HTMLTableElement>(null);

  React.useEffect(() => {
    const table = refTable.current;
    if (!table) return;

    function onClickHandler(event: MouseEvent) {
      let target = event.target as HTMLElement | null;
      while (target && target.nodeName !== 'TH') target = target.parentElement;
      if (!target) return;
      const index = Array.prototype.indexOf.call(
        target?.parentElement?.children,
        target,
      );
      if (sortColumn === index) setReverseSortingOrder((value) => !value);
      else {
        setSortColumn(index);
        setReverseSortingOrder(false);
      }
    }

    table.addEventListener('click', onClickHandler);
    return () => {
      table.removeEventListener('click', onClickHandler);
    };
  });

  return {
    sortColumn,
    reverseSortingOrder,
    refTable,
  };
}
