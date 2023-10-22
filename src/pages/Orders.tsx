import * as React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { ErrorMessage, Paginate, WaitSpinner, YearFilterButtons } from '../ui';
import { usePaginate, useSortTable } from '../hooks';
import {
  API_URL,
  joinFields,
  isStringIncludes,
  pluralize,
  formatDateFromString,
  setDocumentTitle,
  getEmployeeNameByData,
  getFlagImageURLByCountryName,
} from '../utils';
import type { IEmployees, IOrders } from '../models';

function getEmployeeNameById(dataEmployees?: IEmployees, id?: any) {
  const item = dataEmployees?.find((item) => item.employeeId === id);
  if (item) return getEmployeeNameByData(item);
  return id;
}

export default function Orders(): JSX.Element {
  const [filter, setFilter] = React.useState('');
  const [yearFilter, setYearFilter] = React.useState<number>();
  const [yearsSet, setYearsSet] = React.useState<Set<number>>(new Set());
  const { id } = useParams();
  const { pathname } = useLocation();
  const { data, error, isLoading } = ReactQuery.useQuery<IOrders>([
    API_URL +
      (pathname.startsWith('/employees/') ? '/Employees/' : '/Customers/') +
      id +
      '/Orders',
  ]);
  const { data: dataEmployees } = ReactQuery.useQuery<IEmployees>([
    API_URL + '/Employees',
  ]);
  const { sortColumn, reverseSortingOrder, refTable } = useSortTable();
  const filteredData = React.useMemo(() => {
    const yearsSetTemp = new Set<number>();
    const computedData = data
      ? data.map((item) => {
          const orderDate = item.orderDate;
          if (orderDate) {
            const date = new Date(item.orderDate);
            const year = date.getFullYear();
            yearsSetTemp.add(year);
          }
          return {
            orderId: item.orderId,
            customerId: item.customerId,
            employeeId: item.employeeId,
            employeeName: getEmployeeNameById(dataEmployees, item.employeeId),
            orderDate: formatDateFromString(item.orderDate),
            shippedDate: formatDateFromString(item.shippedDate),
            requiredDate: formatDateFromString(item.requiredDate),
            orderDateObject: new Date(item.orderDate),
            shippedDateObject: new Date(item.shippedDate),
            requiredDateObject: new Date(item.requiredDate),
            freight: item.freight,
            shipName: item.shipName,
            addressLine0: joinFields(
              item.shipCountry,
              item.shipRegion,
              item.shipCity,
            ),
            addressLine1: joinFields(item.shipAddress, item.shipPostalCode),
            shipCountry: item.shipCountry,
          };
        })
      : data;
    setYearsSet(yearsSetTemp);
    let filteredData =
      computedData && filter
        ? computedData.filter((item) => {
            return Object.keys(item).some((name) => {
              if (name === 'employeeId') return false;
              return isStringIncludes(
                (item as Record<string, any>)[name],
                filter,
              );
            });
          })
        : computedData;
    if (yearFilter !== undefined) {
      filteredData = filteredData?.filter((item) => {
        return new Date(item.orderDate)?.getFullYear() === yearFilter;
      });
    }

    // Sort data
    filteredData?.sort((a, b) => {
      if (!(sortColumn >= 0)) return 0;
      const columns = [
        'orderId',
        'customerId',
        'employeeName',
        'orderDateObject',
        'shippedDateObject',
        'requiredDateObject',
        'freight',
        'shipName',
        'addressLine0',
      ];
      function getColumnValue(item: typeof a) {
        const value = (item as any)[columns[sortColumn]];
        return value;
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
    if (filteredData) filteredData = [...filteredData]; // Toggle data change hooks

    return filteredData;
  }, [
    data,
    filter,
    yearFilter,
    dataEmployees,
    sortColumn,
    reverseSortingOrder,
  ]);

  const { paginateData, paginateStore } = usePaginate(filteredData);
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!filteredData) return <div>No data</div>;
  const isCustomerPage =
    pathname.startsWith('/customers/') && !pathname.endsWith('/orders');
  const isEmployeePage =
    pathname.startsWith('/employees/') && !pathname.endsWith('/orders');
  if (!isCustomerPage && !isEmployeePage) setDocumentTitle('Orders');
  if (filteredData.length === 0 && filter === '' && yearFilter === undefined) {
    return (
      <div>
        <h1 className="m-2 text-center">No orders</h1>
      </div>
    );
  }
  return (
    <section>
      <h1 className="m-2 text-center">Orders</h1>
      <div className="d-flex flex-wrap">
        <div className="input-group w-auto flex-grow-1 m-2">
          <span className="input-group-text">Filter</span>
          <input
            className="p-2 form-control"
            type="search"
            placeholder="Enter filter string here"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
            style={{ minWidth: '200px' }}
          ></input>
        </div>
        <YearFilterButtons
          {...{ yearsSet, yearFilter, setYearFilter }}
          className="m-2"
        />
      </div>
      {filteredData.length !== 0 ? (
        <div>
          <div className="m-2">{pluralize(filteredData.length, 'order')}</div>
          <Paginate paginateStore={paginateStore} />
          <div className="d-flex">
            <table
              ref={refTable}
              className="table table-hover table-striped m-2"
            >
              <thead className="sticky-top bg-white">
                <tr>
                  <th scope="col">#</th>
                  {!isCustomerPage && <th scope="col">Custo&shy;mer ID</th>}
                  {!isEmployeePage && <th scope="col">Emp&shy;loyee</th>}
                  <th scope="col" className="d-none d-sm-table-cell">
                    Order date
                  </th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Shipped date
                  </th>
                  <th scope="col" className="d-none d-md-table-cell">
                    Required date
                  </th>
                  <th scope="col" className="d-none d-xl-table-cell">
                    Freight
                  </th>
                  <th scope="col" className="d-none d-xl-table-cell">
                    Ship name
                  </th>
                  <th scope="col" className="d-none d-sm-table-cell">
                    Ship address
                  </th>
                </tr>
              </thead>
              <tbody className="table-group-divider">
                {paginateData.map((item: any) => (
                  <tr key={item.orderId}>
                    <th scope="row">
                      <NavLink to={'/orders/' + item.orderId}>
                        {item.orderId}
                      </NavLink>
                    </th>
                    {!isCustomerPage && (
                      <td>
                        <NavLink to={'/customers/' + item.customerId}>
                          {item.customerId}
                        </NavLink>
                      </td>
                    )}
                    {!isEmployeePage && (
                      <td>
                        <NavLink
                          to={'/employees/' + item.employeeId}
                          title={'ID: ' + item.employeeId}
                        >
                          {item.employeeName}
                        </NavLink>
                      </td>
                    )}
                    <td className="d-none d-sm-table-cell">{item.orderDate}</td>
                    <td className="d-none d-md-table-cell">
                      {item.shippedDate}
                    </td>
                    <td className="d-none d-md-table-cell">
                      {item.requiredDate}
                    </td>
                    <td className="d-none d-xl-table-cell">{item.freight}</td>
                    <td className="d-none d-xl-table-cell">{item.shipName}</td>
                    <td className="d-none d-sm-table-cell">
                      <div className="hstack">
                        <img
                          className="me-2"
                          src={getFlagImageURLByCountryName(item.shipCountry)}
                          height="20px"
                          alt=""
                        />
                        {item.addressLine0},
                      </div>
                      <div>{item.addressLine1}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Paginate paginateStore={paginateStore} />
        </div>
      ) : (
        <div className="m-2">Orders not found</div>
      )}
    </section>
  );
}
