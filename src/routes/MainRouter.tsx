import React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import { ErrorMessage, WaitSpinner } from '../ui';
import Layout from '../Layout';
import NotFoundRoute from './NotFoundRoute';

const Loadable = (
  Component: React.ComponentType<React.JSX.IntrinsicAttributes>,
) => {
  const LoadableComponent = (props: React.JSX.IntrinsicAttributes) => (
    <React.Suspense fallback={<WaitSpinner />}>
      <Component {...props} />
    </React.Suspense>
  );
  return LoadableComponent;
};

const AboutRoute = Loadable(React.lazy(() => import('./AboutRoute')));
const ChartD3Route = Loadable(React.lazy(() => import('./ChartD3Route')));
const ChartJSRoute = Loadable(React.lazy(() => import('./ChartJSRoute')));
const CustomerRoute = Loadable(React.lazy(() => import('./CustomerRoute')));
const CustomersRoute = Loadable(React.lazy(() => import('./CustomersRoute')));
const EmployeeRoute = Loadable(React.lazy(() => import('./EmployeeRoute')));
const EmployeesRoute = Loadable(React.lazy(() => import('./EmployeesRoute')));
const OrderRoute = Loadable(React.lazy(() => import('./OrderRoute')));
const OrderDetailsRoute = Loadable(
  React.lazy(() => import('./OrderDetailsRoute')),
);
const OrderEditRoute = Loadable(React.lazy(() => import('./OrderEditRoute')));
const OrdersRoute = Loadable(React.lazy(() => import('./OrdersRoute')));
const ProductRoute = Loadable(React.lazy(() => import('./ProductRoute')));
const ProductsRoute = Loadable(React.lazy(() => import('./ProductsRoute')));
const SupplierRoute = Loadable(React.lazy(() => import('./SupplierRoute')));
const SuppliersRoute = Loadable(React.lazy(() => import('./SuppliersRoute')));

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
