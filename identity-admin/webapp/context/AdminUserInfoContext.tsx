import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { User } from '../interfaces';
import axios from 'axios';

export type AdminUserInfoContextState = {
  user?: User;
  isLoading: boolean;
  error?: { message: string };
  refetch?: () => void;
};

const AdminUserInfoContext = React.createContext<AdminUserInfoContextState | null>(
  null
);

export function useAdminUserInfo(): AdminUserInfoContextState {
  const contextState = useContext(AdminUserInfoContext);
  if (contextState === null) {
    throw new Error('useUserInfo must be used with a UserInfoProvider');
  }
  return contextState;
}

export const AdminUserInfoProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<AdminUserInfoContextState>({
    isLoading: true,
  });
  const router = useRouter();
  const { userId } = router.query;

  const fetchUser = async (): Promise<void> => {
    setState({ isLoading: true });
    return axios
      .get<User>(`/api/user/${userId}`)
      .then(({ data }) => {
        return setState({ isLoading: false, user: data });
      })
      .catch(error => setState({ isLoading: false, error }));
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <AdminUserInfoContext.Provider value={{ ...state, refetch: fetchUser }}>
      {children}
    </AdminUserInfoContext.Provider>
  );
};

export const TestUserInfoProvider: React.FC<{
  value: AdminUserInfoContextState;
}> = props => {
  return (
    <AdminUserInfoContext.Provider value={props.value}>
      {props.children}
    </AdminUserInfoContext.Provider>
  );
};
