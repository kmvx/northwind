import * as React from 'react';
import * as ReactQuery from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import axios from 'axios';

const queryClient = new ReactQuery.QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async ({ queryKey }) => {
        const url = queryKey[0] as string;
        const response = await axios.get(url);
        const data = response.data;
        //throw new Error('Test network error');
        return data;
      },
      retry: (failureCount, error: any) => {
        //return false;
        if (error.code === 'ERR_NETWORK') return false;
        if (error.response?.status >= 400 && error.response?.status <= 500)
          return false;
        return failureCount < 3;
      },
      staleTime: 60e3, // 1 min
      refetchOnWindowFocus: false,
    },
  },
});

interface ProvidersProps {
  children: React.ReactNode;
}

const Providers: React.FC<ProvidersProps> = ({ children }) => {
  return (
    <ReactQuery.QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools />
    </ReactQuery.QueryClientProvider>
  );
};

export default Providers;
