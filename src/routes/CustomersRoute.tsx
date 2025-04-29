import React from 'react';
import { setDocumentTitle } from '../utils';
import Customers from '../components/Customers';

const CustomersRoute: React.FC = () => {
  setDocumentTitle('Customers');
  return <Customers />;
};

export default CustomersRoute;
