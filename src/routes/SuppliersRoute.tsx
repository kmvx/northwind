import React from 'react';
import { setDocumentTitle } from '../utils';
import Suppliers from '../components/Suppliers';

const SuppliersRoute: React.FC = () => {
  setDocumentTitle('Suppliers');

  return <Suppliers />;
};

export default SuppliersRoute;
