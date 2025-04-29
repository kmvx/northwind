import React from 'react';
import { useParams } from 'react-router-dom';
import { setDocumentTitle } from '../utils';
import Order from '../components/Order';

const OrderRoute: React.FC = () => {
  const { id } = useParams();
  setDocumentTitle('Order #' + id);

  return <Order id={id} />;
};

export default OrderRoute;
