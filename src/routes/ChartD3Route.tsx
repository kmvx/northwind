import React from 'react';
import { setDocumentTitle } from '../utils';
import ChartD3 from '../components/ChartD3';

const ChartD3Route: React.FC = () => {
  setDocumentTitle('Charts');
  return <ChartD3 />;
};

export default ChartD3Route;
