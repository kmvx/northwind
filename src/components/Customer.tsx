import React from 'react';
import { NavLink } from 'react-router-dom';
import { ErrorMessage, Flag, PanelCentred, WaitSpinner } from '../ui';
import { joinFields, setDocumentTitle } from '../utils';
import { useQueryCustomer } from '../net';
import Orders from './Orders';

interface CustomerProps {
  id: string | undefined;
}

const Customer: React.FC<CustomerProps> = ({ id }) => {
  // Network data
  const { data, error, isLoading, refetch } = useQueryCustomer({ id });

  setDocumentTitle(data?.companyName, 'Customers');

  if (error) return <ErrorMessage error={error} retry={refetch} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;

  return (
    <PanelCentred className="customer">
      <h1 className="m-2 text-center">{data.companyName}</h1>
      <h2 className="m-2 text-center fs-5">Customer</h2>
      <div>
        <div className="row">
          <div className="col-md-8">
            <div className="hstack" title="Address">
              <i className="bi bi-geo-alt m-2" />
              <Flag className="ms-2" country={data.country} />
              <b className="m-2">
                {joinFields(
                  data.country,
                  data.region,
                  data.city,
                  data.address,
                  data.postalCode,
                )}
              </b>
            </div>
            <div className="hstack flex-wrap">
              <span className="hstack" title="Phone">
                <i className="bi bi-telephone m-2" />
                <b className="m-2">{data.phone}</b>
              </span>
              {data.fax && (
                <span className="hstack" title="Fax">
                  <i className="bi bi-printer m-2" />
                  <b className="m-2">{data.fax}</b>
                </span>
              )}
            </div>
          </div>
          <div className="col-md-4">
            <div className="hstack" title="ID">
              <i className="bi bi-hash m-2" />
              <b className="m-2">{data.customerId}</b>
            </div>
            <div className="hstack align-items-start" title="Contact">
              <i className="bi bi-person m-2" />
              <span className="m-2 vstack">
                <b>{data.contactName}</b>
                <span>{data.contactTitle}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <NavLink
          to={'/customers/' + id + '/orders'}
          className="btn btn-outline-primary m-2"
        >
          Orders
        </NavLink>
      </div>
      <Orders id={id} isCustomersPage />
    </PanelCentred>
  );
};

export default Customer;
