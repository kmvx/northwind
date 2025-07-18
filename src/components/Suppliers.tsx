import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CountryFilter,
  ErrorMessage,
  ExportDropdown,
  Flag,
  PanelStretched,
  WaitSpinner,
} from '../ui';
import { useParamsBuilder } from '../hooks';
import { isStringIncludes, pluralize } from '../utils';
import { SuppliersWorldMapChart } from '../components/charts';
import { useQuerySuppliers } from '../net';

const Suppliers: React.FC = () => {
  // Filters
  const paramsBuilder = useParamsBuilder();
  const [stringFilter, setStringFilter] = paramsBuilder.str('q');
  const [countryFilter, setCountryFilter] = paramsBuilder.str('country');
  const hasFilter = !!stringFilter || !!countryFilter;
  function onClearFilters() {
    setStringFilter('');
    setCountryFilter('');
  }

  // Network data
  const { data, error, isLoading, refetch } = useQuerySuppliers();

  // Filtered data
  const countries = [...new Set(data?.map((item) => item.country))].sort();
  let filteredData = data;
  if (stringFilter) {
    filteredData = filteredData?.filter((item) =>
      ['companyName', 'country', 'city'].some((name) =>
        isStringIncludes((item as Record<string, any>)[name], stringFilter),
      ),
    );
  }
  if (countryFilter) {
    filteredData = filteredData?.filter(
      (item) => item.country === countryFilter,
    );
  }

  const getContent = () => {
    if (error) return <ErrorMessage error={error} retry={refetch} />;
    if (isLoading) return <WaitSpinner />;
    if (!filteredData) return <div>No data</div>;
    return (
      <>
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
        {!countryFilter && (
          <SuppliersWorldMapChart
            countriesQueryResult={{
              countries: filteredData.map((item) => item.country),
              error,
              isLoading,
              refetch,
            }}
            className="mx-2 my-3"
          />
        )}
      </>
    );
  };

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
              value={stringFilter}
              onChange={(event) => setStringFilter(event.target.value)}
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
        <input
          className="btn btn-primary m-2"
          type="button"
          value="Clear filters"
          disabled={!hasFilter}
          onClick={onClearFilters}
        />
        <ExportDropdown data={filteredData} name="Suppliers" />
      </div>
      {getContent()}
    </PanelStretched>
  );
};

export default Suppliers;
