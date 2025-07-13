import React from 'react';
import axios from 'axios';
import clsx from 'clsx';
import CopyButton from './CopyButton';

const ErrorMessage: React.FC<{
  error: Error;
  retry?: () => void;
  className?: string;
}> = ({ error, retry, className }) => {
  let text = 'Error: ' + error.message;
  if (error instanceof axios.AxiosError && error?.response?.data) {
    text += '\nData:\n' + JSON.stringify(error?.response?.data, null, 4);
  }

  return (
    <div className={clsx('m-2 text-danger', className)}>
      <div className="alert alert-danger d-flex align-items-center align-content-stretch flex-wrap gap-3">
        <i className="bi bi-exclamation-triangle fs-3" />
        <div
          className="flex-grow-1"
          title={error.message}
          style={{ whiteSpace: 'pre-wrap' }}
        >
          {text}
        </div>
        <CopyButton content={text} />
        {retry && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => retry()}
            title="Refetch network request"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorMessage;
