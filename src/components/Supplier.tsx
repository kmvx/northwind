import React from 'react';
import {
  CopyButton,
  ErrorMessage,
  Flag,
  PanelCentred,
  WaitSpinner,
} from '../ui';
import { joinFields, setDocumentTitle } from '../utils';
import { useQuerySupplier } from '../net';
import Products from '../components/Products';

interface SupplierProps {
  id: string | undefined;
}

const Supplier: React.FC<SupplierProps> = ({ id }) => {
  const { data, error, isLoading, refetch } = useQuerySupplier({ id });

  setDocumentTitle(data?.companyName, 'Supplier');

  if (error) return <ErrorMessage error={error} retry={refetch} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;

  return (
    <PanelCentred>
      <div className="m-2">
        <h1 className="text-center">{data.companyName}</h1>
        <h2 className="text-center fs-5">Supplier</h2>
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
            <div className="hstack" title="Phone">
              <i className="bi bi-telephone m-2" />
              <b className="m-2">{data.phone}</b>
              <CopyButton content={data.phone} />
            </div>
          </div>
          <div className="col-md-4">
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
      <Products supplierId={id} />
    </PanelCentred>
  );
};

export default Supplier;
