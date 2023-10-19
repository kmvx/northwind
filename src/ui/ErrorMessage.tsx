import axios from 'axios';
import clsx from 'clsx';

export default function ErrorMessage({
  error,
  className,
}: {
  error: any;
  className?: string;
}): JSX.Element {
  return (
    <div className={clsx('m-2 text-danger', className)}>
      <div>Error: {(error as Error).message}</div>
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
