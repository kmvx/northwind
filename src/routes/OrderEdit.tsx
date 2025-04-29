import React from 'react';
import { PanelCentred } from '../ui';
import { setDocumentTitle } from '../utils';

const OrderEditRoute: React.FC = () => {
  setDocumentTitle('Add new order');
  return (
    <PanelCentred>
      <h1 className="text-center m-2">Add new order</h1>
      <hr className="m-2" />
      <form
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="">
          <div className="m-2">
            <label className="form-label">Freight</label>
            <input
              name="freight"
              className="form-control"
              placeholder="Enter order freight here"
              type="number"
            />
            <div className="valid-feedback">Looks good.</div>
          </div>
        </div>
        <hr className="m-2" />
        <div className="hstack">
          <input
            type="submit"
            className="ms-auto btn btn-outline-primary m-2"
            value="Add new order"
          />
        </div>
      </form>
    </PanelCentred>
  );
};

export default OrderEditRoute;
