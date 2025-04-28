import React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import {
  DiscontinuedFilterButtons,
  ErrorMessage,
  Paginate,
  WaitSpinner,
} from '../ui';
import { usePaginate, useParamsBuilder, useSortTable } from '../hooks';
import {
  API_URL,
  isStringIncludes,
  pluralize,
  setDocumentTitle,
  getCategoryNameById,
} from '../utils';
import type { ICategories, IProducts } from '../models';
import { Discontinued } from '../ui';

const Products: React.FC<{
  supplierId?: string;
}> = ({ supplierId }) => {
  // Params
  const { categoryId } = useParams();
  const categoryIdNumber =
    categoryId == undefined ? undefined : parseInt(categoryId, 10);

  // Filters
  const paramsBuilder = useParamsBuilder();
  const [stringFilter, setStringFilter] = paramsBuilder.str('q');
  const [discontinuedFilter, setDicontinuedFilter] =
    paramsBuilder.tristate('discontinued');
  const hasFilter = !!stringFilter || discontinuedFilter !== undefined;
  function onClearFilters() {
    setStringFilter('');
    setDicontinuedFilter(undefined);
  }

  // Network data
  const { data, error, isLoading, refetch } = ReactQuery.useQuery<IProducts>({
    queryKey: [API_URL + '/Products'],
  });
  const { data: dataCategories } = ReactQuery.useQuery<ICategories>({
    queryKey: [API_URL + '/Categories'],
  });

  // Sort data
  const { sortColumn, reverseSortingOrder, refTable } = useSortTable();
  const filteredData = React.useMemo(() => {
    if (!data) return undefined;
    let filteredData =
      data && supplierId
        ? data.filter((item) => String(item.supplierId) == supplierId)
        : data;
    if (categoryId !== undefined) {
      filteredData = filteredData.filter((item) => {
        return item.categoryId === categoryIdNumber;
      });
    }
    if (stringFilter) {
      filteredData = filteredData.filter((item) =>
        ['productName', 'quantityPerUnit'].some((name) => {
          const categoryName = getCategoryNameById(
            dataCategories,
            item.categoryId,
          );
          if (
            typeof categoryName === 'string' &&
            isStringIncludes(categoryName, stringFilter)
          )
            return true;
          return isStringIncludes(
            (item as Record<string, any>)[name],
            stringFilter,
          );
        }),
      );
    }
    if (discontinuedFilter !== undefined) {
      filteredData = filteredData.filter(
        (item) => item.discontinued === discontinuedFilter,
      );
    }

    // Sort data
    filteredData.sort((a, b) => {
      if (!(sortColumn >= 0)) return 0;
      const columns = [
        'productId',
        'productName',
        'categoryId',
        'quantityPerUnit',
        'unitPrice',
        'unitsInStock',
        'unitsOnOrder',
        'reorderLevel',
        'discontinued',
      ];
      function getColumnValue(item: typeof a) {
        const value = (item as any)[columns[sortColumn]];
        if (sortColumn === 2) return getCategoryNameById(dataCategories, value);
        else return value;
      }
      const aValue = getColumnValue(a);
      const bValue = getColumnValue(b);
      let compareResult;
      if (typeof aValue === 'string' || typeof bValue === 'string')
        compareResult = aValue.localeCompare(bValue);
      else compareResult = bValue - aValue;
      if (aValue instanceof Date || bValue instanceof Date)
        compareResult = -compareResult;
      if (reverseSortingOrder) compareResult = -compareResult;
      if (sortColumn === 0) compareResult = -compareResult;
      return compareResult;
    });
    filteredData = [...filteredData]; // Toggle data change hooks

    return filteredData;
  }, [
    data,
    dataCategories,
    stringFilter,
    discontinuedFilter,
    supplierId,
    categoryId,
    categoryIdNumber,
    sortColumn,
    reverseSortingOrder,
  ]);

  const { paginateData, paginateStore } = usePaginate(filteredData, 15);

  const categoryNameProducts = getCategoryNameById(
    dataCategories,
    categoryIdNumber,
  );
  if (!supplierId) setDocumentTitle(categoryNameProducts, 'Products');

  const getContent = () => {
    if (error) return <ErrorMessage error={error} retry={refetch} />;
    if (isLoading) return <WaitSpinner />;
    if (!filteredData) return <div>No data</div>;
    return (
      <>
        {filteredData.length !== 0 ? (
          <div>
            <div className="m-2">
              {pluralize(filteredData.length, 'product')}
            </div>
            <Paginate paginateStore={paginateStore} />
            <div className="d-flex">
              <table
                ref={refTable}
                className="table table-hover table-striped m-2"
              >
                <THead />
                <tbody className="table-group-divider">
                  {paginateData.map((item: any) => {
                    const categoryName = getCategoryNameById(
                      dataCategories,
                      item.categoryId,
                    );
                    return (
                      <tr key={item.productId}>
                        <th scope="row">{item.productId}</th>
                        <td>
                          <div className="d-flex flex-wrap">
                            <NavLink
                              to={'/products/' + item.productId}
                              className="flex-fill"
                            >
                              {item.productName}
                            </NavLink>
                            <span className="d-none d-sm-table-cell d-md-none">
                              <NavLink
                                to={'/products/category/' + item.categoryId}
                              >
                                {categoryName}
                              </NavLink>
                            </span>
                          </div>
                          <div className="d-md-none d-flex flex-wrap">
                            <span className="flex-fill"></span>
                            <span>Unit price: ${item.unitPrice}</span>
                          </div>
                        </td>
                        <td
                          className="d-none d-md-table-cell"
                          title={item.categoryId}
                        >
                          <NavLink
                            to={'/products/category/' + item.categoryId}
                            className="d-block h-100"
                          >
                            {categoryName}
                          </NavLink>
                        </td>
                        <td className="d-none d-md-table-cell">
                          {item.quantityPerUnit}
                        </td>
                        <td className="d-none d-md-table-cell">
                          ${item.unitPrice}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {item.unitsInStock}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {item.unitsOnOrder}
                        </td>
                        <td className="d-none d-lg-table-cell">
                          {item.reorderLevel}
                        </td>
                        <td className="d-none d-xl-table-cell">
                          <Discontinued discontinued={item.discontinued} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
                <THead />
              </table>
            </div>
            <Paginate paginateStore={paginateStore} />
          </div>
        ) : (
          <div className="m-2">Products not found</div>
        )}
      </>
    );
  };

  const THead = () => {
    return (
      <thead className="sticky-top bg-white">
        <tr>
          <th scope="col">#</th>
          <th scope="col">
            <div className="d-flex flex-wrap">
              <span className="flex-fill">Name</span>
              <span className="d-none d-sm-table-cell d-md-none">Category</span>
            </div>
            <div className="d-md-none d-flex flex-wrap">
              <span className="flex-fill"></span>
              <span>Unit price</span>
            </div>
          </th>
          <th scope="col" className="d-none d-md-table-cell">
            Category
          </th>
          <th scope="col" className="d-none d-md-table-cell">
            Quan&shy;tity per unit
          </th>
          <th scope="col" className="d-none d-md-table-cell">
            Unit price
          </th>
          <th scope="col" className="d-none d-lg-table-cell">
            Units in stock
          </th>
          <th scope="col" className="d-none d-lg-table-cell">
            Units on order
          </th>
          <th scope="col" className="d-none d-lg-table-cell">
            Reorder level
          </th>
          <th scope="col" className="d-none d-xl-table-cell">
            Discon&shy;tinued
          </th>
        </tr>
      </thead>
    );
  };

  if (supplierId && data?.length === 0) return <div>No products</div>;

  return (
    <section>
      <h2 className="m-2 text-center">
        <span>Products</span>
        {categoryId !== undefined && <span>, {categoryNameProducts}</span>}
      </h2>
      <div className="d-flex flex-wrap">
        <div className="input-group w-auto flex-grow-1 m-2">
          <span className="input-group-text">Filter</span>
          <input
            className="p-2 form-control"
            type="search"
            placeholder="Enter filter string here"
            value={stringFilter}
            onChange={(event) => setStringFilter(event.target.value)}
          ></input>
        </div>
        <DiscontinuedFilterButtons
          {...{ discontinuedFilter, setDicontinuedFilter }}
        />
        <input
          className="btn btn-primary m-2"
          type="button"
          value="Clear filters"
          disabled={!hasFilter}
          onClick={onClearFilters}
        />
      </div>
      {getContent()}
    </section>
  );
};

export default Products;
