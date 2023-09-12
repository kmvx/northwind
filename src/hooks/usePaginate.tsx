import * as React from 'react';

export default function usePaginate(data?: any[], itemsPerPage = 10) {
  const [paginateData, setPaginateData] = React.useState<any[]>([]);
  const [pageCount, setPageCount] = React.useState(0);
  const [activePageIndex, setActivePageIndex] = React.useState(0);
  if (activePageIndex >= pageCount && activePageIndex !== 0)
    setActivePageIndex(0);
  React.useEffect(() => {
    if (!data) return;
    setPageCount(Math.ceil(data.length / itemsPerPage));
  }, [data, itemsPerPage]);
  React.useEffect(() => {
    if (!data) return;
    setPaginateData(
      data.slice(
        activePageIndex * itemsPerPage,
        (activePageIndex + 1) * itemsPerPage,
      ),
    );
  }, [data, activePageIndex, itemsPerPage]);
  return {
    paginateData,
    paginateStore: {
      pageCount,
      activePageIndex,
      setActivePageIndex,
    },
  };
}
