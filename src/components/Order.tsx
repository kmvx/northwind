import React from 'react';
import { NavLink } from 'react-router-dom';
import { CopyButton, Flag, PanelCentred } from '../ui';
import {
  joinFields,
  formatDateFromString,
  getEmployeeNameByData,
} from '../utils';
import {
  useQueryOrder,
  useQueryOrderCustomer,
  useQueryOrderEmployee,
  useQueryOrderShipper,
} from '../net';
import OrderDetails from './OrderDetails';

interface OrderProps {
  id: string | undefined;
}

const Order: React.FC<OrderProps> = ({ id }) => {
  const { data: dataCustomer } = useQueryOrderCustomer({ id });
  const { data: dataEmployee } = useQueryOrderEmployee({ id });
  const { data: dataOrder } = useQueryOrder({ id });
  const { data: dataShipper } = useQueryOrderShipper({ id });

  return (
    <PanelCentred>
      <div className="m-2">
        <h1 className="text-center">Order #{id}</h1>
        <div className="u-prop-grid">
          {dataCustomer && (
            <>
              <span>Customer:</span>
              <span className="hstack justify-content-end">
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
              <span className="hstack justify-content-end">
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
            <hr />
            <h4 className="text-center">Shipment</h4>
            <div title="Ship name">
              <i className="bi bi-building m-2" />
              <b>{dataOrder.shipName}</b>
            </div>
            <div className="hstack" title="Ship address">
              <i className="bi bi-geo-alt m-2" />
              <Flag className="me-2" country={dataOrder.shipCountry} />
              <b>
                {joinFields(
                  dataOrder.shipCountry,
                  dataOrder.shipRegion,
                  dataOrder.shipCity,
                  dataOrder.shipAddress,
                  dataOrder.shipPostalCode,
                )}
              </b>
            </div>
          </>
        )}
        {dataShipper && (
          <div className="hstack align-items-center flex-wrap column-gap-4">
            <div title="Shipper name">
              <i className="bi bi-truck m-2" />
              <b>{dataShipper.companyName}</b>
            </div>
            <div
              title="Shipper telephone"
              className="d-flex align-items-center"
            >
              <i className="bi bi-telephone m-2" />
              <b>{dataShipper.phone}</b>
              <CopyButton content={dataShipper.phone} />
            </div>
          </div>
        )}
        <div>&nbsp;</div>
      </div>
      <OrderDetails id={id} isOrdersPage />
    </PanelCentred>
  );
};

export default Order;
