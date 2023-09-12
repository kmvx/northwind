import axios from 'axios';

export default function ErrorMessage({
  error,
  className,
}: {
  error: any;
  className?: string;
}): JSX.Element {
  return (
    <div className={'m-2 text-danger ' + (className || '')}>
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
