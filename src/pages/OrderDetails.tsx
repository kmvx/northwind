import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { ErrorMessage, PanelCentred, WaitSpinner } from '../ui';
import { API_URL, pluralize, setDocumentTitle } from '../utils';
import { useSortTable } from '../hooks';
import type { IOrderDetails, IProducts } from '../models';

export default function OrderDetails(): JSX.Element {
  const { id } = useParams();
  const { pathname } = useLocation();
  const isOrders = pathname.startsWith('/orders/');
  const { data, error, isLoading } = ReactQuery.useQuery<IOrderDetails>({
    queryKey: [
      API_URL + (isOrders ? '/Orders/' : '/Products/') + id + '/OrderDetails',
    ],
  });
  const { data: dataProducts } = ReactQuery.useQuery<IProducts>({
    queryKey: [API_URL + '/Orders/' + id + '/Products'],
    enabled: isOrders,
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

  if (!isOrders) setDocumentTitle('Order details');
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!filteredData) return <div>No data</div>;
  return (
    <PanelCentred>
      <h3 className="m-2 text-center">Order details</h3>
      <div className="m-2">
        {pluralize(filteredData.length, 'order detail')}
      </div>
      <table
        ref={refTable}
        className="table table-hover table-striped m-2 w-auto"
      >
        <thead className="sticky-top bg-white">
          <tr>
            <th scope="col">{isOrders ? 'Product' : 'Order ID'}</th>
            <th scope="col">Unit price</th>
            <th scope="col">Qu&shy;an&shy;tity</th>
            <th scope="col">Dis&shy;cou&shy;nt</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {filteredData.map((item, index) => (
            <tr key={index}>
              {isOrders ? (
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
              <td>{item.unitPrice}</td>
              <td>{item.quantity}</td>
              <td>{item.discount * 100}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </PanelCentred>
  );
}
