import React from 'react';
import { useParams } from 'react-router-dom';
import Employee from '../components/Employee';

const EmployeeRoute: React.FC = () => {
  const { id } = useParams();

  return <Employee id={id} />;
};

export default EmployeeRoute;
