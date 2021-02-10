import { useState, useEffect } from 'react';
import axios from 'axios';

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
};

export function useUserInfo(): UserInfoQuery {
  const [data, setData] = useState<UserInfo>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  useEffect(() => {
    const fetchUser = async () => {
      await axios
        .get<UserInfo>('/api/users/me')
        .then(({ data: userData, status, statusText }) => {
          if (status !== 200) {
            throw Error(statusText);
          }
          setIsLoading(false);
          setData(userData);
        })
        .catch((fetchError) => {
          setIsLoading(false);
          setError(fetchError.message);
        });
    };

    fetchUser();
  }, []);

  return { data, isLoading, error };
}
