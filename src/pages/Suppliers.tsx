import * as React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { NavLink } from 'react-router-dom';
import {
  CountryFilterDropdown,
  ErrorMessage,
  PanelStretched,
  WaitSpinner,
} from '../ui';
import {
  API_URL,
  isStringIncludes,
  pluralize,
  setDocumentTitle,
  getFlagImageURLByCountryName,
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
          <CountryFilterDropdown
            className="h-100"
            countryFilter={countryFilter}
            setCountryFilter={setCountryFilter}
          />
        </div>
      </div>
      <div className="m-2">{pluralize(filteredData.length, 'supplier')}</div>
      <div className="suppliers__list">
        {filteredData.map((item) => (
          <NavLink
            to={'/suppliers/' + item.supplierId}
            className="card m-2 p-2 shadow"
            key={item.supplierId}
          >
            <h5
              className="card-title flex-grow-1"
              title="Supplier company name"
            >
              {item.companyName}
            </h5>
            <span
              className="card-text hstack justify-content-end"
              title="Supplier HQ location"
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
          </NavLink>
        ))}
      </div>
    </PanelStretched>
  );
}
