import React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useLocation, useParams } from 'react-router-dom';
import {
  CountryFilter,
  ErrorMessage,
  Flag,
  Paginate,
  WaitSpinner,
  YearFilterButtons,
} from '../ui';
import {
  useMemoWaitCursor,
  usePaginate,
  useParamsBuilder,
  useSortTable,
} from '../hooks';
import {
  API_URL,
  joinFields,
  isStringIncludes,
  pluralize,
  formatDateFromString,
  setDocumentTitle,
  getEmployeeNameByData,
} from '../utils';
import type { IEmployees, IOrders, IShippers } from '../models';
import { OrdersWorldMapChart } from '../components/WorldMapChart';

function getEmployeeNameById(dataEmployees?: IEmployees, id?: number) {
  const item = dataEmployees?.find((item) => item.employeeId === id);
  if (item) return getEmployeeNameByData(item);
  else return id;
}

function ShipperPreview({
  dataShippers,
  id,
}: {
  dataShippers?: IShippers;
  id?: number;
}) {
  const item = dataShippers?.find((item) => item.shipperId === id);
  return (
    <span title={`Phone: ${item?.phone}`}>{item ? item.companyName : id}</span>
  );
}

export default function Orders(): React.JSX.Element {
  // Filters
  const paramsBuilder = useParamsBuilder();
  const [stringFilter, setStringFilter] = paramsBuilder.str('q');
  const [countryFilter, setCountryFilter] = paramsBuilder.str('country');
  const [yearFilter, setYearFilter] = paramsBuilder.num('year');
  const hasFilter = !!stringFilter || !!countryFilter || !!yearFilter;
  function onClearFilters() {
    setStringFilter('');
    setCountryFilter('');
    setYearFilter(undefined);
  }

  // Params
  const { id } = useParams();
  const { pathname } = useLocation();
  const isCustomersPage = pathname.startsWith('/customers/');
  const isEmployeesPage = pathname.startsWith('/employees/');
  const isShippersPage = pathname.startsWith('/shippers/');
  const isOrdersPage = pathname.startsWith('/orders');
  const isOrdersEndPage = !isOrdersPage && pathname.endsWith('/orders');

  // Network data
  const { data, error, isLoading } = ReactQuery.useQuery<IOrders>({
    queryKey: [
      API_URL +
        (isCustomersPage
          ? '/Customers/'
          : isEmployeesPage
            ? '/Employees/'
            : isShippersPage
              ? '/Shippers/'
              : '') +
        (id || '') +
        '/Orders',
    ],
  });
  const { data: dataEmployees } = ReactQuery.useQuery<IEmployees>({
    queryKey: [API_URL + '/Employees'],
  });
  const { data: dataShippers } = ReactQuery.useQuery<IShippers>({
    queryKey: [API_URL + '/Shippers'],
  });

  // Prepare data
  const [yearsSet, setYearsSet] = React.useState<Set<number>>(new Set());
  const preparedData = useMemoWaitCursor(() => {
    const yearsSetTemp = new Set<number>();
    const preparedData = data?.map((item) => {
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
        shipVia: item.shipVia,
        orderDate: formatDateFromString(item.orderDate),
        shippedDate: formatDateFromString(item.shippedDate),
        requiredDate: formatDateFromString(item.requiredDate),
        orderDateObject: new Date(item.orderDate),
        shippedDateObject: new Date(item.shippedDate),
        requiredDateObject: new Date(item.requiredDate),
        freight: item.freight,
        shipName: item.shipName,
        addressLine: joinFields(
          item.shipCountry,
          item.shipRegion,
          item.shipCity,
          item.shipAddress,
          item.shipPostalCode,
        ),
        shipCountry: item.shipCountry,
      };
    });
    setYearsSet(yearsSetTemp);
    return preparedData;
  }, [data, dataEmployees]);

  const countries = [...new Set(data?.map((item) => item.shipCountry))].sort();

  // Filter and sort data
  const { sortColumn, reverseSortingOrder, refTable } = useSortTable();
  const filteredData = React.useMemo(() => {
    let filteredData = preparedData;

    // String filter
    if (stringFilter) {
      filteredData = filteredData?.filter((item) => {
        return Object.keys(item).some((name) => {
          if (name === 'employeeId') return false;
          return isStringIncludes(
            (item as Record<string, any>)[name],
            stringFilter,
          );
        });
      });
    }

    // Country filter
    if (countryFilter) {
      filteredData = filteredData?.filter(
        (item) => item.shipCountry === countryFilter,
      );
    }

    // Year filter
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
        'shipVia',
        'orderDateObject',
        'shippedDateObject',
        'requiredDateObject',
        'freight',
        'shipName',
        'addressLine',
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
    preparedData,
    stringFilter,
    countryFilter,
    yearFilter,
    sortColumn,
    reverseSortingOrder,
  ]);

  const { paginateData, paginateStore } = usePaginate(filteredData);
  if (isOrdersPage || isOrdersEndPage) setDocumentTitle('Orders');
  if (error) return <ErrorMessage error={error} />;
  if (isLoading || (!filteredData && data)) return <WaitSpinner />;
  if (!filteredData) return <div>No data</div>;
  if (filteredData.length === 0 && !hasFilter) {
    return (
      <div>
        <h1 className="m-2 text-center">No orders</h1>
      </div>
    );
  }
  return (
    <section>
      <h1 className="m-2 text-center">
        <span>Orders</span>
        {isEmployeesPage && isOrdersEndPage && (
          <span>
            {' '}
            of employee{' '}
            <NavLink to={'/employees/' + id} title={'ID: ' + id}>
              {getEmployeeNameById(dataEmployees, parseInt(id || ''))}
            </NavLink>
          </span>
        )}
        {isCustomersPage && isOrdersEndPage && (
          <span>
            {' '}
            of customer <NavLink to={'/customers/' + id}>{id}</NavLink>
          </span>
        )}
      </h1>
      <div className="d-flex flex-wrap">
        <div className="input-group w-auto flex-grow-1 m-2">
          <span className="input-group-text">Filter</span>
          <input
            className="p-2 form-control"
            type="search"
            placeholder="Enter filter string here"
            value={stringFilter}
            onChange={(event) => setStringFilter(event.target.value)}
            style={{ minWidth: '200px' }}
          ></input>
        </div>
        {!isCustomersPage && (
          <div className="m-2">
            <CountryFilter
              className="h-100"
              countryFilter={countryFilter}
              setCountryFilter={setCountryFilter}
              countries={countries}
            />
          </div>
        )}
        <YearFilterButtons
          {...{ yearsSet, yearFilter, setYearFilter }}
          className="m-2"
        />
        <input
          className="btn btn-primary m-2"
          type="button"
          value="Clear filters"
          disabled={!hasFilter}
          onClick={onClearFilters}
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
                  {!isCustomersPage && <th scope="col">Custo&shy;mer ID</th>}
                  {!isEmployeesPage && <th scope="col">Emp&shy;loyee</th>}
                  <th scope="col" className="d-none d-sm-table-cell">
                    Shipper
                  </th>
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
                    {!isCustomersPage && (
                      <td>
                        <NavLink to={'/customers/' + item.customerId}>
                          {item.customerId}
                        </NavLink>
                      </td>
                    )}
                    {!isEmployeesPage && (
                      <td>
                        <NavLink
                          to={'/employees/' + item.employeeId}
                          title={'ID: ' + item.employeeId}
                        >
                          {item.employeeName}
                        </NavLink>
                      </td>
                    )}
                    <td className="d-none d-sm-table-cell">
                      <ShipperPreview
                        dataShippers={dataShippers}
                        id={item.shipVia}
                      />
                    </td>
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
                        <Flag className="me-2" country={item.shipCountry} />
                        {item.addressLine}
                      </div>
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
      {!countryFilter && !isCustomersPage && (
        <OrdersWorldMapChart
          countriesQueryResult={{
            countries: filteredData.map((item) => item.shipCountry),
            error,
            isLoading,
          }}
          className="mx-2 my-3"
        />
      )}
    </section>
  );
}
