import * as ReactPaginate from 'react-paginate';

export default function Paginate({ paginateStore }: any): JSX.Element {
  const { pageCount, activePageIndex, setActivePageIndex } = paginateStore;
  const onPageChange = (event: any) => {
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
}
