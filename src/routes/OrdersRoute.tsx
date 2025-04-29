import React from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { setDocumentTitle } from '../utils';
import Orders from '../components/Orders';

const OrdersRoute: React.FC = () => {
  // Params
  const { id } = useParams();
  const { pathname } = useLocation();
  const isCustomersPage = pathname.startsWith('/customers/');
  const isEmployeesPage = pathname.startsWith('/employees/');
  const isShippersPage = pathname.startsWith('/shippers/');
  const isOrdersPage = pathname.startsWith('/orders');
  const isOrdersEndPage = !isOrdersPage && pathname.endsWith('/orders');

  if (isOrdersPage || isOrdersEndPage) setDocumentTitle('Orders');

  return (
    <Orders
      {...{
        id,
        isCustomersPage,
        isEmployeesPage,
        isShippersPage,
        isOrdersEndPage,
      }}
    />
  );
};

export default OrdersRoute;
