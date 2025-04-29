import React from 'react';
import { setDocumentTitle } from '../utils';
import OrderEdit from '../components/OrderEdit';

const OrderEditRoute: React.FC = () => {
  setDocumentTitle('Add new order');

  return <OrderEdit />;
};

export default OrderEditRoute;
