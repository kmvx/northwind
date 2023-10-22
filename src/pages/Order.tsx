import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import { PanelCentred } from '../ui';
import {
  API_URL,
  joinFields,
  setDocumentTitle,
  formatDateFromString,
  getEmployeeNameByData,
  getFlagImageURLByCountryName,
} from '../utils';
import { OrderDetails } from '.';
import type { ICustomer, IEmployee, IOrder, IShipper } from '../models';

export default function Order(): JSX.Element {
  const { id } = useParams();
  const { data: dataCustomer } = ReactQuery.useQuery<ICustomer>({
    queryKey: [API_URL + '/Orders/' + id + '/Customer'],
  });
  const { data: dataEmployee } = ReactQuery.useQuery<IEmployee>({
    queryKey: [API_URL + '/Orders/' + id + '/Employee'],
  });
  const { data: dataOrder } = ReactQuery.useQuery<IOrder>({
    queryKey: [API_URL + '/Orders/' + id],
  });
  const { data: dataShipper } = ReactQuery.useQuery<IShipper>({
    queryKey: [API_URL + '/Orders/' + id + '/Shipper'],
  });
  setDocumentTitle('Order #' + id);
  return (
    <PanelCentred>
      <div className="m-2">
        <h1 className="text-center">Order #{id}</h1>
        {dataCustomer && (
          <div className="hstack">
            <span>Customer:&nbsp;</span>
            <NavLink to={'/customers/' + dataCustomer.customerId}>
              <b>{dataCustomer.companyName}</b> ({dataCustomer.customerId})
            </NavLink>
            <img
              className="ms-2"
              src={getFlagImageURLByCountryName(dataCustomer.country)}
              height="20px"
              alt=""
            />
            <span>&nbsp;.</span>
          </div>
        )}
        {dataEmployee && (
          <div className="hstack">
            <span>Employee:&nbsp;</span>
            <NavLink to={'/employees/' + dataEmployee.employeeId}>
              <b>{getEmployeeNameByData(dataEmployee)}</b>
            </NavLink>
            <img
              className="ms-2"
              src={getFlagImageURLByCountryName(dataEmployee.country)}
              height="20px"
              alt=""
            />
            <span>&nbsp;.</span>
          </div>
        )}
        {dataOrder && (
          <>
            <div>
              Order date: <b>{formatDateFromString(dataOrder.orderDate)}</b>.
            </div>
            <div>
              Shipped date: <b>{formatDateFromString(dataOrder.shippedDate)}</b>
              .
            </div>
            <div>
              Required date:{' '}
              <b>{formatDateFromString(dataOrder.requiredDate)}</b>.
            </div>
            <div>
              Freight: <b>{dataOrder.freight}</b>.
            </div>
            <div>
              Ship name: <b>{dataOrder.shipName}</b>.
            </div>
            <div className="hstack">
              Ship address:{' '}
              <img
                className="mx-2"
                src={getFlagImageURLByCountryName(dataOrder.shipCountry)}
                height="20px"
                alt=""
              />
              <b>
                {joinFields(
                  dataOrder.shipCountry,
                  dataOrder.shipRegion,
                  dataOrder.shipCity,
                  dataOrder.shipAddress,
                  dataOrder.shipPostalCode,
                )}
              </b>
              .
            </div>
          </>
        )}
        {dataShipper && (
          <div>
            Shipper: <b>{dataShipper.companyName}</b>, phone:{' '}
            <b>{dataShipper.phone}</b>.
          </div>
        )}
        <div>&nbsp;</div>
      </div>
      <OrderDetails />
    </PanelCentred>
  );
}
