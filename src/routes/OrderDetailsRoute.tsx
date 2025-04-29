import React from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { setDocumentTitle } from '../utils';
import OrderDetails from '../components/OrderDetails';

const OrderDetailsRoute: React.FC = () => {
  // Params
  const { id } = useParams();
  const { pathname } = useLocation();
  const isOrdersPage = pathname.startsWith('/orders/');

  if (!isOrdersPage) setDocumentTitle('Order details');

  return <OrderDetails id={id} isOrdersPage={isOrdersPage} />;
};

export default OrderDetailsRoute;
