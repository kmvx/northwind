import * as React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import {
  CountryFilter,
  ErrorMessage,
  Flag,
  PanelStretched,
  WaitSpinner,
} from '../ui';
import {
  API_URL,
  isStringIncludes,
  getEmployeeNameByData,
  pluralize,
  setDocumentTitle,
} from '../utils';
import type { IEmployees } from '../models';

export default function Employees({
  className,
  reportsTo,
}: {
  className?: string;
  reportsTo?: string;
}): JSX.Element {
  const [filter, setFilter] = React.useState('');
  const [countryFilter, setCountryFilter] = React.useState('');
  const { data, error, isLoading } = ReactQuery.useQuery<IEmployees>({
    queryKey: [API_URL + '/Employees'],
  });
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;
  if (!reportsTo) setDocumentTitle('Employees');
  let filteredData = data;
  if (reportsTo) {
    filteredData = filteredData.filter(
      (item) => String(item.reportsTo) == reportsTo,
    );
  }
  if (filter) {
    filteredData = filteredData.filter((item) =>
      ['title', 'country', 'city'].some((name) => {
        if (isStringIncludes(getEmployeeNameByData(item), filter)) return true;
        return isStringIncludes((item as Record<string, any>)[name], filter);
      }),
    );
  }
  const countries = [
    ...new Set(filteredData?.map((item) => item.country)),
  ].sort();
  if (countryFilter) {
    filteredData = filteredData.filter(
      (item) => item.country === countryFilter,
    );
  }
  if (
    filteredData.length === 0 &&
    reportsTo &&
    filter === '' &&
    countryFilter === ''
  ) {
    return <></>;
  }
  return (
    <PanelStretched className={className}>
      <h2 className="m-2 text-center">
        {reportsTo ? 'Direct subordinates' : 'Employees'}
      </h2>
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
        <div className="flex-lg-grow-0 flex-grow-1 m-2">
          <CountryFilter
            className="h-100"
            countryFilter={countryFilter}
            setCountryFilter={setCountryFilter}
            countries={countries}
          />
        </div>
      </div>
      <div className="m-2">{pluralize(filteredData.length, 'employee')}</div>
      <div className="employees__list">
        {filteredData.map((item) => (
          <NavLink
            to={'/employees/' + item.employeeId}
            className="card m-2 p-3 shadow"
            key={item.employeeId}
          >
            <h4 className="card-title" title="Employee name">
              {getEmployeeNameByData(item)}
            </h4>
            <div className="hstack">
              <img
                src={`/assets/img/database/${item.firstName.toLowerCase()}.jpg`}
                width="70px"
                className="m-2"
                alt=""
                title="Employee photo"
              />
              <div className="vstack">
                <span
                  className="flex-grow-1 card-text text-end"
                  title="Employee title"
                >
                  {item.title}
                </span>
                <span
                  className="card-text hstack flex-wrap justify-content-end"
                  title="Employee location"
                >
                  <i className="bi bi-geo-alt m-2" />
                  <span>
                    {item.country}, {item.city}
                  </span>
                  <Flag className="ms-2" country={item.country} />
                </span>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </PanelStretched>
  );
}
