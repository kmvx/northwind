import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  CountryFilter,
  ErrorMessage,
  Flag,
  Paginate,
  PanelStretched,
  WaitSpinner,
} from '../ui';
import { usePaginate } from '../hooks';
import { isStringIncludes, pluralize, setDocumentTitle } from '../utils';
import { useParamsBuilder } from '../hooks';
import { CustomersWorldMapChart } from '../components/charts';
import { useQueryCustomers } from '../net';

const CustomersRoute: React.FC = () => {
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
  const { data, error, isLoading, refetch } = useQueryCustomers();

  // Filter data
  const countries = [...new Set(data?.map((item) => item.country))].sort();
  const filteredData = React.useMemo(() => {
    let result = data;
    if (result) {
      if (stringFilter) {
        result = result.filter((item) =>
          ['companyName', 'customerId', 'country', 'city'].some((name) =>
            isStringIncludes((item as Record<string, any>)[name], stringFilter),
          ),
        );
      }
      if (countryFilter) {
        result = result.filter((item) => item.country === countryFilter);
      }
    }
    return result;
  }, [data, stringFilter, countryFilter]);

  const { paginateData, paginateStore } = usePaginate(filteredData, 20);

  setDocumentTitle('Customers');

  const getContent = () => {
    if (error) return <ErrorMessage error={error} retry={refetch} />;
    if (isLoading) return <WaitSpinner />;
    if (!filteredData) return <div>No data</div>;
    return (
      <>
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
                className="card-text hstack flex-wrap justify-content-end"
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
        {!countryFilter && (
          <CustomersWorldMapChart
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
      <h2 className="m-2 text-center">Customers</h2>
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
      </div>
      {getContent()}
    </PanelStretched>
  );
};

export default CustomersRoute;
