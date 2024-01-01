import { setDocumentTitle } from '../utils';
import { OrdersChart, WorldMapChart } from '../components';

export default function Dashboard(): JSX.Element {
  setDocumentTitle('Dashboard');
  return (
    <section className="hstack align-items-stretch flex-wrap">
      <div className="m-2 flex-grow-1 hstack align-items-stretch">
        <OrdersChart />
      </div>
      <div className="m-2 flex-grow-1 hstack align-items-stretch">
        <WorldMapChart />
      </div>
    </section>
  );
}
