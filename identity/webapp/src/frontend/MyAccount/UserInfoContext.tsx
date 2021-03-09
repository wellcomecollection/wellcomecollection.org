import React, { useContext, useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

export type UserInfo = {
  firstName: string;
  lastName: string;
  email: string;
  barcode: string;
};

export type UserInfoContextState = {
  user?: UserInfo;
  isLoading: boolean;
  error?: { message: string };
};

const UserInfoContext = React.createContext<UserInfoContextState | null>(null);

export function useUserInfo(): UserInfoContextState {
  const contextState = useContext(UserInfoContext);
  if (contextState === null) {
    throw new Error('useUserInfo must be used with a UserInfoProvider');
  }
  return contextState;
}

export const UserInfoProvider: React.FC = ({ children }) => {
  const [state, setState] = useState<UserInfoContextState>({ isLoading: true });

  useEffect(() => {
    const source = axios.CancelToken.source();
    const fetchUser = async (): Promise<void> => {
      setState({ isLoading: true });
      return axios
        .get<UserInfo>('/api/users/me', { cancelToken: source.token })
        .then(({ data }) => setState({ isLoading: false, user: data }))
        .catch((error: AxiosError) => {
          if (!axios.isCancel(error)) {
            setState({ isLoading: false, error });
          }
        });
    };
    fetchUser();

    return () => {
      source.cancel();
    };
  }, []);

  return <UserInfoContext.Provider value={state}>{children}</UserInfoContext.Provider>;
};

export const withUserInfo = (WrappedComponent: React.ComponentType): React.FC => {
  const displayName = WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithUserInfo = () => (
    <UserInfoProvider>
      <WrappedComponent />
    </UserInfoProvider>
  );

  ComponentWithUserInfo.displayName = `withUserInfo(${displayName})`;

  return ComponentWithUserInfo;
};
