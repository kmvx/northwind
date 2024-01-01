import { setDocumentTitle } from '../utils';
import { OrdersChart } from '../components';
import {
  CustomersWorldMapChart,
  OrdersWorldMapChart,
  SuppliersWorldMapChart,
} from '../components/WorldMapChart';

export default function Dashboard(): JSX.Element {
  setDocumentTitle('Dashboard');
  return (
    <section className="hstack align-items-stretch flex-wrap">
      <div className="m-2 flex-grow-1 hstack align-items-stretch">
        <OrdersChart />
      </div>
      <div className="m-2 flex-grow-1 hstack align-items-stretch">
        <OrdersWorldMapChart />
      </div>
      <div className="m-2 flex-grow-1 hstack align-items-stretch">
        <CustomersWorldMapChart />
      </div>
      <div className="m-2 flex-grow-1 hstack align-items-stretch">
        <SuppliersWorldMapChart />
      </div>
    </section>
  );
}
