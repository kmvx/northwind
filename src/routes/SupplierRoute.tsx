import React from 'react';
import { useParams } from 'react-router-dom';
import Supplier from '../components/Supplier';

const SupplierRoute: React.FC = () => {
  const { id } = useParams();

  return <Supplier id={id} />;
};

export default SupplierRoute;
