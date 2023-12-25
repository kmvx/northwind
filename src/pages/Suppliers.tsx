import * as React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import {
  CountryFilterDropdown,
  ErrorMessage,
  Flag,
  PanelStretched,
  WaitSpinner,
} from '../ui';
import {
  API_URL,
  isStringIncludes,
  pluralize,
  setDocumentTitle,
} from '../utils';
import type { ISuppliers } from '../models';

export default function Suppliers(): JSX.Element {
  const [filter, setFilter] = React.useState('');
  const [countryFilter, setCountryFilter] = React.useState('');
  const { data, error, isLoading } = ReactQuery.useQuery<ISuppliers>({
    queryKey: [API_URL + '/Suppliers'],
  });
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;
  setDocumentTitle('Suppliers');
  const countries = [...new Set(data?.map((item) => item.country))].sort();
  let filteredData = data;
  if (filter) {
    filteredData = filteredData.filter((item) =>
      ['companyName', 'country', 'city'].some((name) =>
        isStringIncludes((item as Record<string, any>)[name], filter),
      ),
    );
  }
  if (countryFilter) {
    filteredData = filteredData.filter(
      (item) => item.country === countryFilter,
    );
  }
  return (
    <PanelStretched>
      <h2 className="m-2 text-center">Suppliers</h2>
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
          <div className="input-group">
            <span className="input-group-text">Country</span>
            <CountryFilterDropdown
              className="h-100"
              countryFilter={countryFilter}
              setCountryFilter={setCountryFilter}
              countries={countries}
            />
          </div>
        </div>
      </div>
      <div className="m-2">{pluralize(filteredData.length, 'supplier')}</div>
      <div className="suppliers__list">
        {filteredData.map((item) => (
          <NavLink
            to={'/suppliers/' + item.supplierId}
            className="card m-2 p-3 shadow"
            key={item.supplierId}
          >
            <h5
              className="card-title flex-grow-1"
              title="Supplier company name"
            >
              {item.companyName}
            </h5>
            <span
              className="card-text hstack flex-wrap justify-content-end"
              title="Supplier HQ location"
            >
              <i className="bi bi-geo-alt m-2" />
              <span>
                {item.country}, {item.city}
              </span>
              <Flag className="ms-2" country={item.country} />
            </span>
          </NavLink>
        ))}
      </div>
    </PanelStretched>
  );
}
