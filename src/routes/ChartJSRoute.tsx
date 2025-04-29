import React from 'react';
import { setDocumentTitle } from '../utils';
import ChartJS from '../components/ChartJS';

const ChartsJSRoute: React.FC = () => {
  setDocumentTitle('Charts');
  return <ChartJS />;
};

export default ChartsJSRoute;
