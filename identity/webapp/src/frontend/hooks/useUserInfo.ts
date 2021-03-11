import { useState, useEffect, useCallback } from 'react';
import { callMiddlewareApi } from '../../utility/middleware-api-client';

export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  barcode: string;
};

type UserInfoQuery = {
  data?: UserInfo;
  isLoading: boolean;
  error?: string;
  refetch: () => void;
};

export function useUserInfo(): UserInfoQuery {
  const [data, setData] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const fetchUser = useCallback(async () => {
    setIsLoading(true);
    setError(undefined);
    await callMiddlewareApi('GET', '/api/users/me')
      .then(({ data: userData }) => {
        setData(userData);
        setIsLoading(false);
      })
      .catch(fetchError => {
        setIsLoading(false);
        setError(fetchError.message);
      });
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return { data, isLoading, error, refetch: fetchUser };
}
