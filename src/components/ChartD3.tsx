import React from 'react';
import {
  OrdersChart,
  CustomersBarChart,
  OrdersBarChart,
  SuppliersBarChart,
  CustomersWorldMapChart,
  OrdersWorldMapChart,
  SuppliersWorldMapChart,
} from './charts';
import { useQueryCustomers, useQueryOrders, useQuerySuppliers } from '../net';

const ChartD3: React.FC = () => {
  // Network data
  const {
    data: dataCustomers,
    error: errorCustomers,
    isLoading: isLoadingCustomers,
    refetch: refetchCustomers,
  } = useQueryCustomers();
  const {
    data: dataOrders,
    error: errorOrders,
    isLoading: isLoadingOrders,
    refetch: refetchOrders,
  } = useQueryOrders();
  const {
    data: dataSuppliers,
    error: errorSuppliers,
    isLoading: isLoadingSuppliers,
    refetch: refetchSuppliers,
  } = useQuerySuppliers();

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
};

export default ChartD3;
