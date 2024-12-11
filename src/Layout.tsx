import * as React from 'react';
import * as ReactRouterDOM from 'react-router-dom';
import clsx from 'clsx';

interface NavItemProps {
  className?: string;
  children: React.ReactNode;
  key?: any;
  to: string;
}

const NavItem: React.FC<NavItemProps> = ({
  className,
  children,
  key,
  ...props
}) => {
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
};

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const pages: Readonly<
    (
      | {
          title: string;
          to: string;
          imageClassName: string;
        }
      | undefined
    )[]
  > = [
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
  ] as const;

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
};

export default Layout;
