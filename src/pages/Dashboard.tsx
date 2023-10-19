import { setDocumentTitle } from '../utils';
import { OrdersChart } from '../components';

export default function Dashboard(): JSX.Element {
  setDocumentTitle('Dashboard');
  return (
    <section>
      <OrdersChart />
    </section>
  );
}
