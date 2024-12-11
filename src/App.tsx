import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import clsx from 'clsx';
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

function ErrorFallback({
  error,
  resetErrorBoundary,
}: FallbackProps): JSX.Element {
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
}

interface NavItemProps {
  className?: string;
  children: React.ReactNode;
  key?: any;
  to: string;
}
function NavItem({
  className,
  children,
  key,
  ...props
}: NavItemProps): JSX.Element {
  const { NavLink } = ReactRouterDOM;
  return (
    <NavLink
      className={({ isActive }) => clsx(className, { active: isActive })}
      key={key}
      {...props}
    >
      {children}
    </NavLink>
  );
}
function Layout({ children }: { children: React.ReactNode }): JSX.Element {
  const pages: (
    | {
        title: string;
        to: string;
        imageClassName: string;
      }
    | undefined
  )[] = [
    undefined,
    { title: 'About', to: '/', imageClassName: 'bi bi-info-circle' },
    undefined,
    {
      title: 'Customers',
      to: '/customers',
      imageClassName: 'bi bi-currency-dollar',
    },
    { title: 'Employees', to: '/employees', imageClassName: 'bi bi-people' },
    { title: 'Orders', to: '/orders', imageClassName: 'bi bi-credit-card' },
    { title: 'Products', to: '/products', imageClassName: 'bi bi-egg-fried' },
    { title: 'Suppliers', to: '/suppliers', imageClassName: 'bi bi-hammer' },
    //undefined,
    //{ title: 'Add order',  to: '/orderNew',  imageClassName: "bi bi-ticket-perforated" },
    undefined,
    { title: 'Charts', to: '/charts', imageClassName: 'bi bi-graph-up' },
    //{ title: 'Charts', to: '/chartjs', imageClassName: 'bi bi-graph-up' },
  ];
  return (
    <div className="hstack align-items-stretch vh-100">
      <nav
        className="app-sidebar app-sidebar-toggler collapse collapse-horizontal show
                flex-grow-0 flex-shrink-0 vstack overflow-auto"
      >
        <div className="vstack text-bg-dark">
          <div className="text-center">
            <button
              className="btn-close btn-close-white m-2"
              data-bs-toggle="collapse"
              data-bs-target=".app-sidebar-toggler"
            ></button>
          </div>
          {pages.map((page, index) => (
            <React.Fragment key={index}>
              {page ? (
                <NavItem className="py-2 px-3 text-nowrap" to={page.to}>
                  <i className={clsx('m-2', page.imageClassName)}></i>
                  <span className="m-2">{page.title}</span>
                </NavItem>
              ) : (
                <hr className="my-2 mx-3" key={index} />
              )}
            </React.Fragment>
          ))}
        </div>
      </nav>
      <div className="app-mainbar flex-grow-1 vstack">
        <div className="app-sidebar-toggler collapse navbar p-0">
          <button
            className="navbar-toggler m-2"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target=".app-sidebar-toggler"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
        </div>
        <main className="app-contents w-100 vstack">{children}</main>
      </div>
    </div>
  );
}
function App(): JSX.Element {
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
}

export default App;
