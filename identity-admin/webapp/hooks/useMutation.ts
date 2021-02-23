import { useState } from 'react';

type Mutation<T> = {
  isLoading: boolean;
  mutate: (newData?: T) => Promise<void>;
};

export function useMutation<T = unknown>(
  url: string,
  method = 'put'
): Mutation<T> {
  const [isLoading, setIsLoading] = useState(false);

  const mutate = async (data?: T) => {
    setIsLoading(true);
    const config = data
      ? {
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      : {};
    return fetch(url, { method, ...config }).then(() => setIsLoading(false));
  };

  return { mutate, isLoading };
}
