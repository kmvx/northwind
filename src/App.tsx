import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import { ErrorBoundary, type FallbackProps } from 'react-error-boundary';

import {
  About,
  ChartD3,
  ChartJS,
  Customer,
  Customers,
  Employee,
  Employees,
  NotFound,
  Order,
  OrderDetails,
  OrderEdit,
  Orders,
  Product,
  Products,
  Supplier,
  Suppliers,
} from './pages';
import { ErrorMessage } from './ui';
import './App.scss';
import Providers from './Providers';
import Layout from './Layout';

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

const App: React.FC = () => {
  const { Routes, Route } = ReactRouterDOM;
  //const Router = ReactRouterDOM.HashRouter;
  const Router = ReactRouterDOM.BrowserRouter;
  return (
    <Providers>
      <Router>
        <Layout>
          <ErrorBoundary FallbackComponent={ErrorFallback}>
            <Routes>
              <Route path="/" element={<About />} />
              <Route path="/customers" element={<Customers />} />
              <Route path="/customers/:id" element={<Customer />} />
              <Route path="/customers/:id/orders" element={<Orders />} />
              <Route path="/employees" element={<Employees />} />
              <Route path="/employees/:id" element={<Employee />} />
              <Route path="/employees/:id/orders" element={<Orders />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/orders/:id" element={<Order />} />
              <Route path="/orderNew" element={<OrderEdit />} />
              <Route path="/products" element={<Products />} />
              <Route
                path="/products/category/:categoryId"
                element={<Products />}
              />
              <Route path="/products/:id" element={<Product />} />
              <Route
                path="/products/:id/order-details"
                element={<OrderDetails />}
              />
              <Route path="/shippers/:id/orders" element={<Orders />} />
              <Route path="/suppliers" element={<Suppliers />} />
              <Route path="/suppliers/:id" element={<Supplier />} />
              <Route path="/chartjs" element={<ChartJS />} />
              <Route path="/charts" element={<ChartD3 />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ErrorBoundary>
        </Layout>
      </Router>
    </Providers>
  );
};

export default App;
