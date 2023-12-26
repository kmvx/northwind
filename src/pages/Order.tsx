import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import { Flag, PanelCentred } from '../ui';
import {
  API_URL,
  joinFields,
  setDocumentTitle,
  formatDateFromString,
  getEmployeeNameByData,
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
        <div className="u-prop-grid">
          {dataCustomer && (
            <>
              <span>Customer:</span>
              <span className="hstack text-end">
                <NavLink to={'/customers/' + dataCustomer.customerId}>
                  <b>{dataCustomer.companyName}</b> ({dataCustomer.customerId})
                </NavLink>
                <Flag className="ms-2" country={dataCustomer.country} />
              </span>
            </>
          )}
          {dataEmployee && (
            <>
              <span>Employee:</span>
              <span className="hstack text-end">
                <NavLink to={'/employees/' + dataEmployee.employeeId}>
                  <b>{getEmployeeNameByData(dataEmployee)}</b>
                </NavLink>
                <Flag className="ms-2" country={dataEmployee.country} />
              </span>
            </>
          )}
        </div>
        {dataOrder && (
          <div className="u-prop-grid">
            <span>Order date:</span>
            <b className="text-end">
              {formatDateFromString(dataOrder.orderDate)}
            </b>
            <span>Shipped date:</span>
            <b className="text-end">
              {formatDateFromString(dataOrder.shippedDate)}
            </b>
            <span>Required date:</span>
            <b className="text-end">
              {formatDateFromString(dataOrder.requiredDate)}
            </b>
            <span>Freight:</span>
            <b className="text-end">{dataOrder.freight}</b>
          </div>
        )}
        {dataOrder && (
          <>
            <div>
              Ship name: <b>{dataOrder.shipName}</b>.
            </div>
            <div className="hstack">
              Ship address:{' '}
              <Flag className="mx-2" country={dataOrder.shipCountry} />
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
