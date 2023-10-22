import * as React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import { ErrorMessage, PanelStretched, WaitSpinner } from '../ui';
import {
  API_URL,
  isStringIncludes,
  getEmployeeNameByData,
  pluralize,
  setDocumentTitle,
  getFlagImageURLByCountryName,
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
  const { data, error, isLoading } = ReactQuery.useQuery<IEmployees>({
    queryKey: [API_URL + '/Employees'],
  });
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;
  if (!reportsTo) setDocumentTitle('Employees');
  let filteredData = reportsTo
    ? data.filter((item) => String(item.reportsTo) == reportsTo)
    : data;
  filteredData = filter
    ? filteredData.filter((item) =>
        ['title', 'country', 'city'].some((name) => {
          if (isStringIncludes(getEmployeeNameByData(item), filter))
            return true;
          return isStringIncludes((item as Record<string, any>)[name], filter);
        }),
      )
    : filteredData;
  if (filteredData.length === 0 && reportsTo && filter === '') return <></>;
  return (
    <PanelStretched className={className}>
      <h2 className="m-2 text-center">
        {reportsTo ? 'Direct subordinates' : 'Employees'}
      </h2>
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
      <div className="m-2">{pluralize(filteredData.length, 'employee')}</div>
      <div className="employees__list">
        {filteredData.map((item) => (
          <NavLink
            to={'/employees/' + item.employeeId}
            className="card m-2 p-3 shadow"
            key={item.employeeId}
          >
            <h4 className="card-title flex-grow-1" title="Employee name">
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
                <span className="card-text text-end" title="Employee title">
                  {item.title}
                </span>
                <span
                  className="card-text hstack justify-content-end"
                  title="Employee location"
                >
                  <i className="bi bi-geo-alt m-2" />
                  <img
                    className="me-2"
                    src={getFlagImageURLByCountryName(item.country)}
                    height="20px"
                    alt=""
                  />
                  <span>
                    {item.country}, {item.city}
                  </span>
                </span>
              </div>
            </div>
          </NavLink>
        ))}
      </div>
    </PanelStretched>
  );
}
