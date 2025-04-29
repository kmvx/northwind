import React from 'react';
import { useParams } from 'react-router-dom';
import Customer from '../components/Customer';

const CustomerRoute: React.FC = () => {
  const { id } = useParams();
  return <Customer id={id} />;
};

export default CustomerRoute;
