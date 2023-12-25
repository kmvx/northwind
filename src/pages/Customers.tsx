import * as React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import {
  CountryFilterDropdown,
  ErrorMessage,
  Flag,
  Paginate,
  PanelStretched,
  WaitSpinner,
} from '../ui';
import { usePaginate } from '../hooks';
import {
  API_URL,
  isStringIncludes,
  pluralize,
  setDocumentTitle,
} from '../utils';
import type { ICustomers } from '../models';

export default function Customers(): JSX.Element {
  setDocumentTitle('Customers');
  const [filter, setFilter] = React.useState('');
  const [countryFilter, setCountryFilter] = React.useState('');
  const { data, error, isLoading } = ReactQuery.useQuery<ICustomers>({
    queryKey: [API_URL + '/Customers'],
  });
  const countries = [...new Set(data?.map((item) => item.country))].sort();
  const filteredData = React.useMemo(() => {
    let result = data;
    if (result) {
      if (filter) {
        result = result.filter((item) =>
          ['companyName', 'customerId', 'country', 'city'].some((name) =>
            isStringIncludes((item as Record<string, any>)[name], filter),
          ),
        );
      }
      if (countryFilter) {
        result = result.filter((item) => item.country === countryFilter);
      }
    }
    return result;
  }, [data, filter, countryFilter]);
  const { paginateData, paginateStore } = usePaginate(filteredData, 20);
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!filteredData) return <div>No data</div>;
  return (
    <PanelStretched>
      <h2 className="m-2 text-center">Customers</h2>
      <div className="d-flex flex-wrap">
        <div className="flex-grow-1 m-2">
          <div className="input-group">
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
        <div className="m-2">
          <CountryFilterDropdown
            className="h-100"
            countryFilter={countryFilter}
            setCountryFilter={setCountryFilter}
            countries={countries}
          />
        </div>
      </div>
      <div className="m-2">{pluralize(filteredData.length, 'customer')}</div>
      <Paginate paginateStore={paginateStore} />
      <div className="customers__list">
        {paginateData.map((item: any) => (
          <NavLink
            to={'/customers/' + item.customerId}
            className="card m-2 p-3 shadow"
            key={item.customerId}
          >
            <h5
              className="card-title flex-grow-1"
              title="Customer company name"
            >
              {item.companyName}
            </h5>
            <div className="card-text text-end" title="Customer company ID">
              {item.customerId}
            </div>
            <div
              className="card-text hstack justify-content-end"
              title="Customer HQ location"
            >
              <i className="bi bi-geo-alt m-2" />
              <span>
                {item.country}, {item.city}
              </span>
              <Flag className="ms-2" country={item.country} />
            </div>
          </NavLink>
        ))}
      </div>
      <Paginate paginateStore={paginateStore} />
    </PanelStretched>
  );
}
