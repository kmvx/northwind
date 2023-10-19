import * as React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import { ErrorMessage, Paginate, WaitSpinner } from '../ui';
import { usePaginate } from '../hooks';
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
  const filteredData = React.useMemo(() => {
    const computedData = data
      ? data.map((item) => ({
          orderId: item.orderId,
          customerId: item.customerId,
          employeeId: item.employeeId,
          employeeName: getEmployeeNameById(dataEmployees, item.employeeId),
          orderDate: formatDateFromString(item.orderDate),
          shippedDate: formatDateFromString(item.shippedDate),
          requiredDate: formatDateFromString(item.requiredDate),
          freight: item.freight,
          shipName: item.shipName,
          addressLine0: joinFields(
            item.shipCountry,
            item.shipRegion,
            item.shipCity,
          ),
          addressLine1: joinFields(item.shipAddress, item.shipPostalCode),
          shipCountry: item.shipCountry,
        }))
      : data;
    const filteredData =
      computedData && filter
        ? computedData.filter((item) =>
            Object.keys(item).some((name) => {
              if (name === 'employeeId') return false;
              return isStringIncludes(
                (item as Record<string, any>)[name],
                filter,
              );
            }),
          )
        : computedData;
    return filteredData;
  }, [data, filter, dataEmployees]);

  const { paginateData, paginateStore } = usePaginate(filteredData);
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!filteredData) return <div>No data</div>;
  setDocumentTitle('Orders');
  if (filteredData.length === 0)
    return (
      <div>
        <h1 className="m-2 text-center">No orders</h1>
      </div>
    );
  const isCustomerPage =
    pathname.startsWith('/customers/') && !pathname.endsWith('/orders');
  const isEmployeePage =
    pathname.startsWith('/employees/') && !pathname.endsWith('/orders');
  return (
    <section>
      <h1 className="m-2 text-center">Orders</h1>
      <div className="d-flex">
        <div className="input-group m-2">
          <span className="input-group-text">Filter</span>
          <input
            className="p-2 form-control"
            type="search"
            placeholder="Enter filter string here"
            value={filter}
            onChange={(event) => setFilter(event.target.value)}
          ></input>
        </div>
      </div>
      <div className="m-2">{pluralize(filteredData.length, 'order')}</div>
      <Paginate paginateStore={paginateStore} />
      <div className="d-flex">
        <table className="table table-hover table-striped m-2">
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
                <td className="d-none d-md-table-cell">{item.shippedDate}</td>
                <td className="d-none d-md-table-cell">{item.requiredDate}</td>
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
    </section>
  );
}
