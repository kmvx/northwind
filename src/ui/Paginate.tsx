import React from 'react';
import * as ReactPaginate from 'react-paginate';

const Paginate: React.FC<{
  paginateStore: any;
}> = ({ paginateStore }) => {
  const { pageCount, activePageIndex, setActivePageIndex } = paginateStore;
  const onPageChange = (event: { selected: number }) => {
    setActivePageIndex(event.selected);
  };
  return (
    <>
      {pageCount >= 2 && (
        <nav>
          <ReactPaginate.default
            pageCount={pageCount}
            forcePage={activePageIndex}
            onPageChange={onPageChange}
            pageRangeDisplayed={10}
            containerClassName="pagination flex-wrap m-2"
            pageClassName="page-item"
            pageLinkClassName="page-link"
            previousClassName="page-item"
            previousLinkClassName="page-link"
            nextClassName="page-item"
            nextLinkClassName="page-link"
            breakClassName="page-item"
            breakLinkClassName="page-link"
            activeClassName="active"
            previousLabel="&laquo;"
            nextLabel="&raquo;"
          />
        </nav>
      )}
    </>
  );
};

export default Paginate;
