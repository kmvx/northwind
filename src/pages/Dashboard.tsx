import { setDocumentTitle } from '../utils';
import { OrdersChart } from '../components';

export default function Dashboard(): JSX.Element {
  setDocumentTitle('Dashboard');
  return (
    <section>
      <div className="m-2">
        <OrdersChart />
      </div>
    </section>
  );
}
