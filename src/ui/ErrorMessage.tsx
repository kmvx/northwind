import React from 'react';
import axios from 'axios';
import clsx from 'clsx';

export default function ErrorMessage({
  error,
  className,
}: {
  error: Error;
  className?: string;
}): React.JSX.Element {
  return (
    <div className={clsx('m-2 text-danger', className)}>
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
  );
}
