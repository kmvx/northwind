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
      <div className="container">
        <OrdersChart className="" />
      </div>
      <div className="container">
        <div className="row">
          <div className="col-lg-6 d-flex">
            <OrdersWorldMapChart className="my-3" allowZoom />
          </div>
          <div className="col-lg-6 d-flex">
            <OrdersBarChart className="my-3" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 d-flex">
            <CustomersWorldMapChart className="my-3" hue={30} allowZoom />
          </div>
          <div className="col-lg-6 d-flex">
            <CustomersBarChart className="my-3" />
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 d-flex">
            <SuppliersWorldMapChart className="my-3" hue={120} allowZoom />
          </div>
          <div className="col-lg-6 d-flex">
            <SuppliersBarChart className="my-3" />
          </div>
        </div>
      </div>
    </section>
  );
}
