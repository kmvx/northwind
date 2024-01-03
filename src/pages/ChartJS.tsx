import * as ReactQuery from '@tanstack/react-query';
import { ErrorMessage, PanelStretched, WaitSpinner } from '../ui';
import { API_URL, setDocumentTitle } from '../utils';
import type { IOrders } from '../models';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const chartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'bottom' as const,
    },
  },
};

export default function Charts(): JSX.Element {
  setDocumentTitle('Charts');
  const { data, error, isLoading } = ReactQuery.useQuery<IOrders>({
    queryKey: [API_URL + '/Orders'],
  });
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  const ordersCountByCountry: Record<string, number> = {};
  data?.forEach((item) => {
    if (!ordersCountByCountry[item.shipCountry])
      ordersCountByCountry[item.shipCountry] = 1;
    else ordersCountByCountry[item.shipCountry]++;
  });
  const countriesAndOrderCount = Object.entries(ordersCountByCountry).sort(
    (a, b) => b[1] - a[1],
  );
  const chartData = {
    labels: countriesAndOrderCount.map((item) => item[0]),
    datasets: [
      {
        label: 'Count of shipments',
        data: countriesAndOrderCount.map((item) => item[1]),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  return (
    <PanelStretched>
      <h2 className="m-2 text-center">
        <span>Distribution of count of shipments of products by country</span>
      </h2>
      <Bar data={chartData} options={chartOptions} className="m-5" />
    </PanelStretched>
  );
}
