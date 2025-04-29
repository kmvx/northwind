import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { Flag, PanelCentred } from '../ui';
import {
  joinFields,
  setDocumentTitle,
  formatDateFromString,
  getEmployeeNameByData,
} from '../utils';
import { OrderDetails } from '.';
import {
  useQueryOrder,
  useQueryOrderCustomer,
  useQueryOrderEmployee,
  useQueryOrderShipper,
} from '../net';

const Order: React.FC = () => {
  const { id } = useParams();
  const { data: dataCustomer } = useQueryOrderCustomer({ id });
  const { data: dataEmployee } = useQueryOrderEmployee({ id });
  const { data: dataOrder } = useQueryOrder({ id });
  const { data: dataShipper } = useQueryOrderShipper({ id });
  setDocumentTitle('Order #' + id);

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
          <div className="hstack">
            <div title="Shipper name">
              <i className="bi bi-truck m-2" />
              <b>{dataShipper.companyName}</b>
            </div>
            <div title="Shipper telephone">
              <i className="bi bi-telephone m-2" />
              <b>{dataShipper.phone}</b>
            </div>
          </div>
        )}
        <div>&nbsp;</div>
      </div>
      <OrderDetails />
    </PanelCentred>
  );
};

export default Order;
