import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useParams } from 'react-router-dom';
import { ErrorMessage, PanelCentred, WaitSpinner } from '../ui';
import { API_URL, setDocumentTitle, getCategoryNameById } from '../utils';
import type { ICategories, IProduct, ISupplier } from '../models';
import { Discontinued } from '../ui';

function SupplierLink({
  id,
  className,
}: {
  id: number;
  className?: string;
}): JSX.Element {
  const hasId = Boolean(id);
  const { data, error, isLoading } = ReactQuery.useQuery<ISupplier>(
    [API_URL + '/Suppliers/' + id],
    {
      enabled: hasId,
    },
  );
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) {
    if (hasId) return <WaitSpinner />;
    else return <></>;
  }
  if (!data) return <div>No data</div>;
  return (
    <span className={className}>
      <NavLink to={'/suppliers/' + id}>{data.companyName}</NavLink>
    </span>
  );
}

export default function Product(): JSX.Element {
  const { id } = useParams();
  const { data, error, isLoading } = ReactQuery.useQuery<IProduct>([
    API_URL + '/Products/' + id,
  ]);
  const { data: dataCategories } = ReactQuery.useQuery<ICategories>([
    API_URL + '/Categories',
  ]);
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;
  setDocumentTitle(data.productName, 'Product');
  return (
    <PanelCentred>
      <h1 className="m-2 text-center">{data.productName}</h1>
      <h2 className="m-2 text-center fs-5">Product</h2>
      <div className="m-2">
        <div>
          Category:{' '}
          <b>
            <span title={String(data.categoryId)}>
              {getCategoryNameById(dataCategories, data.categoryId)}
            </span>
          </b>
        </div>
        {/*
        <img
          src={`/assets/img/database/${getCategoryNameById(
            dataCategories,
            data.categoryId
          )?.toLowerCase()}.gif`}
          width="96px"
          className=""
          alt=""
        />
        */}
        <div>
          Quantity per unit: <b>{data.quantityPerUnit}</b>
        </div>
        <div>
          Unit price: <b>${data.unitPrice}</b>
        </div>
        <div>
          Units in stock: <b>{data.unitsInStock}</b>
        </div>
        <div>
          Units on order: <b>{data.unitsOnOrder}</b>
        </div>
        <div>
          Reorder level: <b>{data.reorderLevel}</b>
        </div>
        <div className="my-1">
          <Discontinued discontinued={data.discontinued} />
        </div>
      </div>
      <div>
        <NavLink
          to={'/products/' + id + '/order-details'}
          className="btn btn-outline-primary m-2"
        >
          Order details
        </NavLink>
      </div>
      <div className="hstack" title="Supplier">
        <i className="bi bi-bucket m-2 "></i>
        <SupplierLink id={data.supplierId} className="m-2" />
      </div>
    </PanelCentred>
  );
}
