import * as ReactQuery from '@tanstack/react-query';
import { NavLink, useParams, useLocation } from 'react-router-dom';
import { ErrorMessage, PanelCentred, WaitSpinner } from '../ui';
import { API_URL, pluralize, setDocumentTitle } from '../utils';
import type { IOrderDetails, IProducts } from '../models';

export default function OrderDetails(): JSX.Element {
  const { id } = useParams();
  const { pathname } = useLocation();
  const isOrders = pathname.startsWith('/orders/');
  const { data, error, isLoading } = ReactQuery.useQuery<IOrderDetails>([
    API_URL + (isOrders ? '/Orders/' : '/Products/') + id + '/OrderDetails',
  ]);
  const { data: dataProducts } = ReactQuery.useQuery<IProducts>(
    [API_URL + '/Orders/' + id + '/Products'],
    {
      enabled: isOrders,
    },
  );
  if (!isOrders) setDocumentTitle('Order details');
  if (error) return <ErrorMessage error={error} />;
  if (isLoading) return <WaitSpinner />;
  if (!data) return <div>No data</div>;
  return (
    <PanelCentred>
      <h3 className="m-2 text-center">Order details</h3>
      <div className="m-2">{pluralize(data.length, 'order detail')}</div>
      <table className="table table-hover table-striped m-2 w-auto">
        <thead className="sticky-top bg-white">
          <tr>
            <th scope="col">{isOrders ? 'Product' : 'Order ID'}</th>
            <th scope="col">Unit price</th>
            <th scope="col">Qu&shy;an&shy;tity</th>
            <th scope="col">Dis&shy;cou&shy;nt</th>
          </tr>
        </thead>
        <tbody className="table-group-divider">
          {data.map((item, index) => (
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
