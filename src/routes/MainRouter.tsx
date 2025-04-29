import * as ReactRouterDOM from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import {
  AboutRoute as AboutRoute,
  ChartD3Route,
  ChartJSRoute,
  CustomerRoute,
  CustomersRoute,
  EmployeeRoute,
  EmployeesRoute,
  NotFoundRoute,
  OrderRoute,
  OrderDetailsRoute,
  OrderEditRoute,
  OrdersRoute,
  ProductRoute,
  ProductsRoute,
  SupplierRoute,
  SuppliersRoute,
} from '.';
import { ErrorMessage } from '../ui';
import Layout from '../Layout';

const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div className="py-2">
      <div className="m-2">Something went wrong:</div>
      <ErrorMessage error={error} className="m-2" />
      <button
        onClick={resetErrorBoundary}
        className="btn btn-outline-primary m-2"
      >
        Try again
      </button>
    </div>
  );
};

const MainRouter: React.FC = () => {
  const { Routes, Route } = ReactRouterDOM;
  //const Router = ReactRouterDOM.HashRouter;
  const Router = ReactRouterDOM.BrowserRouter;
  return (
    <Router>
      <Layout>
        <ErrorBoundary FallbackComponent={ErrorFallback}>
          <Routes>
            <Route path="/" element={<AboutRoute />} />
            <Route path="/customers" element={<CustomersRoute />} />
            <Route path="/customers/:id" element={<CustomerRoute />} />
            <Route path="/customers/:id/orders" element={<OrdersRoute />} />
            <Route path="/employees" element={<EmployeesRoute />} />
            <Route path="/employees/:id" element={<EmployeeRoute />} />
            <Route path="/employees/:id/orders" element={<OrdersRoute />} />
            <Route path="/orders" element={<OrdersRoute />} />
            <Route path="/orders/:id" element={<OrderRoute />} />
            <Route path="/orderNew" element={<OrderEditRoute />} />
            <Route path="/products" element={<ProductsRoute />} />
            <Route
              path="/products/category/:categoryId"
              element={<ProductsRoute />}
            />
            <Route path="/products/:id" element={<ProductRoute />} />
            <Route
              path="/products/:id/order-details"
              element={<OrderDetailsRoute />}
            />
            <Route path="/shippers/:id/orders" element={<OrdersRoute />} />
            <Route path="/suppliers" element={<SuppliersRoute />} />
            <Route path="/suppliers/:id" element={<SupplierRoute />} />
            <Route path="/chartjs" element={<ChartJSRoute />} />
            <Route path="/charts" element={<ChartD3Route />} />
            <Route path="*" element={<NotFoundRoute />} />
          </Routes>
        </ErrorBoundary>
      </Layout>
    </Router>
  );
};

export default MainRouter;
