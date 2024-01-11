import { setDocumentTitle } from '../utils';
import { OrdersChart } from '../components';
import {
  CustomersBarChart,
  OrdersBarChart,
  SuppliersBarChart,
} from '../components/BarChart';
import {
  CustomersWorldMapChart,
  OrdersWorldMapChart,
  SuppliersWorldMapChart,
} from '../components/WorldMapChart';

export default function ChartD3(): JSX.Element {
  setDocumentTitle('Charts');
  return (
    <section>
      <div className="m-2">
        <OrdersChart />
      </div>
      <div className="hstack align-items-stretch flex-wrap">
        <div className="m-2 flex-grow-1 hstack align-items-stretch">
          <OrdersWorldMapChart />
        </div>
        <div className="m-2 flex-grow-1 hstack align-items-stretch">
          <OrdersBarChart />
        </div>
        <div className="m-2 flex-grow-1 hstack align-items-stretch">
          <CustomersWorldMapChart />
        </div>
        <div className="m-2 flex-grow-1 hstack align-items-stretch">
          <CustomersBarChart />
        </div>
        <div className="m-2 flex-grow-1 hstack align-items-stretch">
          <SuppliersWorldMapChart />
        </div>
        <div className="m-2 flex-grow-1 hstack align-items-stretch">
          <SuppliersBarChart />
        </div>
      </div>
    </section>
  );
}
