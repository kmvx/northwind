import React from 'react';
import { NavLink } from 'react-router-dom';
import { ErrorMessage, PanelCentred, WaitSpinner } from '../ui';
import { pluralize } from '../utils';
import { useSortTable } from '../hooks';
import type { IOrderDetail } from '../models';
import { useQueryOrderDetails, useQueryOrderProducts } from '../net';

interface OrderDetailsProps {
  id: string | undefined;
  isOrdersPage: boolean;
}

const OrderDetails: React.FC<OrderDetailsProps> = ({
  id,
  isOrdersPage = false,
}) => {
  // Network data
  const { data, error, isLoading, refetch } = useQueryOrderDetails({
    isOrdersPage,
    id,
  });
  const { data: dataProducts } = useQueryOrderProducts({
    id,
    enabled: isOrdersPage,
  });

  // Sort data
  const { sortColumn, reverseSortingOrder, refTable } = useSortTable();
  let filteredData = data;
  filteredData?.sort((a, b) => {
    if (!(sortColumn >= 0)) return 0;
    const columns = ['orderId', 'unitPrice', 'quantity', 'discount'];
    function getColumnValue(item: typeof a) {
      const value = (item as any)[columns[sortColumn]];
      return value;
    }
    const aValue = getColumnValue(a);
    const bValue = getColumnValue(b);
    let compareResult;
    if (typeof aValue === 'string' || typeof bValue === 'string')
      compareResult = aValue.localeCompare(bValue);
    else compareResult = bValue - aValue;
    if (aValue instanceof Date || bValue instanceof Date)
      compareResult = -compareResult;
    if (reverseSortingOrder) compareResult = -compareResult;
    if (sortColumn === 0) compareResult = -compareResult;
    return compareResult;
  });
  if (filteredData) filteredData = [...filteredData]; // Toggle data change hooks

  if (error) return <ErrorMessage error={error} retry={refetch} />;
  if (isLoading) return <WaitSpinner />;
  if (!filteredData) return <div>No data</div>;

  // Compute order total money
  function roundMoney(money: number) {
    return Math.round(money * 100) / 100;
  }
  function getTotalCost(item: IOrderDetail) {
    return roundMoney(
      item.unitPrice * item.quantity * (1 - item.discount / 100),
    );
  }
  const total = filteredData.reduce((acc, item) => acc + getTotalCost(item), 0);

  return (
    <PanelCentred>
      <h3 className="m-2 text-center">Order details</h3>
      <div className="m-2">
        {pluralize(filteredData.length, 'order detail')}, ${roundMoney(total)}{' '}
        total.
      </div>
      <table
        ref={refTable}
        className="table table-hover table-striped m-2 w-auto"
      >
        <thead className="position-sticky top-0 bg-white">
          <tr>
            <th scope="col">{isOrdersPage ? 'Product' : 'Order ID'}</th>
            <th scope="col">Unit price</th>
            <th scope="col">Qu&shy;an&shy;tity</th>
            <th scope="col">Dis&shy;cou&shy;nt</th>
            <th scope="col">Total cost</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {filteredData.map((item, index) => (
            <tr key={index}>
              {isOrdersPage ? (
                <td title={'ID: ' + item.productId}>
                  <NavLink to={'/products/' + item.productId}>
                    {dataProducts
                      ? dataProducts[index].productName
                      : item.productId}
                  </NavLink>
                </td>
              ) : (
                <td>
                  <NavLink to={'/orders/' + item.orderId}>
                    {item.orderId}
                  </NavLink>
                </td>
              )}
              <td>${item.unitPrice}</td>
              <td>{item.quantity}</td>
              <td>{item.discount ? item.discount * 100 + '%' : '-'}</td>
              <td>${getTotalCost(item)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PanelCentred>
  );
};

export default OrderDetails;
