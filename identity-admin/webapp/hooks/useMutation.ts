import { useState } from 'react';

type Mutation<T> = {
  isLoading: boolean;
  mutate: (newData: T) => Promise<void>;
};

export function useMutation<T>(url: string, method = 'put'): Mutation<T> {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (data: T) => {
    setIsLoading(true);
    return fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    }).then(() => setIsLoading(false));
  };

  return { mutate, isLoading };
}
