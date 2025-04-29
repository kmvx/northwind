import React from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { ErrorMessage, PanelCentred, WaitSpinner } from '../ui';
import { setDocumentTitle, getCategoryNameById } from '../utils';
import { Discontinued } from '../ui';
import { useQueryCategories, useQueryProduct, useQuerySupplier } from '../net';

const SupplierLink: React.FC<{
  id: number;
  className?: string;
}> = ({ id, className }) => {
  const hasId = Boolean(id);
  const { data, error, isLoading, refetch } = useQuerySupplier({
    id,
    enabled: hasId,
  });
  if (error) return <ErrorMessage error={error} retry={refetch} />;
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
};

const ProductRoute: React.FC = () => {
  const { id } = useParams();

  // Network data
  const { data, error, isLoading, refetch } = useQueryProduct({ id });
  const { data: dataCategories } = useQueryCategories();

  setDocumentTitle(data?.productName, 'Product');

  if (error) return <ErrorMessage error={error} retry={refetch} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;

  return (
    <PanelCentred>
      <h1 className="m-2 text-center">{data.productName}</h1>
      <h2 className="m-2 text-center fs-5">Product</h2>
      <div className="u-prop-grid m-2">
        <span>Category:</span>
        <b className="text-end" title={String(data.categoryId)}>
          <NavLink to={'/products/category/' + data.categoryId}>
            {getCategoryNameById(dataCategories, data.categoryId)}
          </NavLink>
          {/*
          {' '}
          <img
            src={`/assets/img/database/${getCategoryNameById(
              dataCategories,
              data.categoryId,
            )?.toLowerCase()}.gif`}
            height="32px"
            className="u-prop-grid__wide-row"
            alt=""
          />
          */}
        </b>
        <span>Quantity per unit:</span>
        <b className="text-end">{data.quantityPerUnit}</b>
        <span>Unit price:</span>
        <b className="text-end">${data.unitPrice}</b>
        <span>Units in stock:</span>
        <b className="text-end">{data.unitsInStock}</b>
        <span>Units on order:</span>
        <b className="text-end">{data.unitsOnOrder}</b>
        <span>Reorder level:</span>
        <b className="text-end">{data.reorderLevel}</b>
        <div className="u-prop-grid__wide-row my-1">
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
        <i className="bi bi-hammer m-2 "></i>
        <SupplierLink id={data.supplierId} className="m-2" />
      </div>
    </PanelCentred>
  );
};

export default ProductRoute;
