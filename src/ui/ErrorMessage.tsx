import React from 'react';
import axios from 'axios';
import clsx from 'clsx';

export default function ErrorMessage({
  error,
  retry,
  className,
}: {
  error: Error;
  retry?: () => void;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={clsx('m-2 text-danger', className)}>
      <div className="alert alert-danger d-flex align-items-center gap-3">
        <div title={error.message}>
          <div>Error: {error.message}</div>
          {error instanceof axios.AxiosError && error?.response?.data && (
            <>
              <div>Data:</div>
              <div style={{ whiteSpace: 'pre-wrap' }}>
                {JSON.stringify(error?.response?.data, null, 4)}
              </div>
            </>
          )}
        </div>
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
}
