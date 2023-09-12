import * as ReactQuery from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { ErrorMessage, PanelCentred, WaitSpinner } from '../ui';
import {
  API_URL,
  joinFields,
  setDocumentTitle,
  getFlagImageURLByCountryName,
} from '../utils';
import { Products } from '.';
import type { ISupplier } from '../models';

export default function Supplier(): JSX.Element {
  const { id } = useParams();
  const { data, error, isLoading } = ReactQuery.useQuery<ISupplier>([
    API_URL + '/Suppliers/' + id,
  ]);
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;
  setDocumentTitle(data.companyName, 'Supplier');
  return (
    <PanelCentred>
      <div className="m-2">
        <h1 className="text-center">{data.companyName}</h1>
        <h2 className="text-center fs-5">Supplier</h2>
        <div className="row">
          <div className="col-md-7">
            <div className="hstack" title="Address">
              <i className="bi bi-geo-alt m-2" />
              <img
                className="ms-2"
                src={getFlagImageURLByCountryName(data.country)}
                height="20px"
                alt=""
              />
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
            </div>
          </div>
          <div className="col-md-5">
            <div className="hstack" title="Contact">
              <i className="bi bi-person m-2" />
              <span className="m-2">
                <b>{data.contactName}</b> ({data.contactTitle})
              </span>
            </div>
          </div>
        </div>
      </div>
      <Products supplierId={id} />
    </PanelCentred>
  );
}
