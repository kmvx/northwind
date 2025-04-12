import React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { API_URL, setDocumentTitle } from '../utils';
import { OrdersChart } from '../components';
import {
  CustomersBarChart,
  OrdersBarChart,
  SuppliersBarChart,
} from '../components/BarChart';
import {
  CustomersWorldMapChart,
  OrdersWorldMapChart,
  SuppliersWorldMapChart,
} from '../components/WorldMapChart';
import { ICustomers, IOrders, ISuppliers } from '../models';

export default function ChartD3(): React.JSX.Element {
  setDocumentTitle('Charts');

  // Network data
  const {
    data: dataCustomers,
    error: errorCustomers,
    isLoading: isLoadingCustomers,
    refetch: refetchCustomers,
  } = ReactQuery.useQuery<ICustomers>({
    queryKey: [API_URL + '/Customers'],
  });
  const {
    data: dataOrders,
    error: errorOrders,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = ReactQuery.useQuery<IOrders>({
    queryKey: [API_URL + '/Orders'],
  });
  const {
    data: dataSuppliers,
    error: errorSuppliers,
    isLoading: isLoadingSuppliers,
    refetch: refetchSuppliers,
  } = ReactQuery.useQuery<ISuppliers>({
    queryKey: [API_URL + '/Suppliers'],
  });

  return (
    <section>
      <div className="container">
        <OrdersChart className="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-flex">
            <OrdersWorldMapChart
              countriesQueryResult={{
                countries: dataOrders?.map((item) => item.shipCountry),
                error: errorOrders,
                isLoading: isLoadingOrders,
                refetch: refetchOrders,
              }}
              className="my-3"
              allowZoom
            />
          </div>
          <div className="col-lg-6 d-flex">
            <OrdersBarChart className="my-3" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 d-flex">
            <CustomersWorldMapChart
              countriesQueryResult={{
                countries: dataCustomers?.map((item) => item.country),
                error: errorCustomers,
                isLoading: isLoadingCustomers,
                refetch: refetchCustomers,
              }}
              className="my-3"
              hue={30}
              allowZoom
            />
          </div>
          <div className="col-lg-6 d-flex">
            <CustomersBarChart className="my-3" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 d-flex">
            <SuppliersWorldMapChart
              countriesQueryResult={{
                countries: dataSuppliers?.map((item) => item.country),
                error: errorSuppliers,
                isLoading: isLoadingSuppliers,
                refetch: refetchSuppliers,
              }}
              className="my-3"
              hue={120}
              allowZoom
            />
          </div>
          <div className="col-lg-6 d-flex">
            <SuppliersBarChart className="my-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
