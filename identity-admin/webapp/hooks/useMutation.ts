import { useState } from 'react';
import axios, { Method } from 'axios';

type Mutation<T> = {
  isLoading: boolean;
  mutate: (newData?: T) => Promise<void>;
};

export function useMutation<T = unknown>(
  url: string,
  method: Method = 'put'
): Mutation<T> {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (data?: T) => {
    setIsLoading(true);
    const config = data
      ? {
          headers: {
            'Content-Type': 'application/json',
          },
          data,
        }
      : {};
    return axios({
      url,
      method,
      ...config,
      validateStatus: status =>
        (status >= 200 && status < 300) || status === 304,
    }).then(() => setIsLoading(false));
  };

  return { mutate, isLoading };
}
