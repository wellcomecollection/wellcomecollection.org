import React, { useContext, useEffect, useState } from 'react';
import { UserInfo } from '../../types/UserInfo';

const mockApiCall = () =>
  Promise.resolve({
    status: 200,
    data: {
      firstName: 'Steve',
      lastName: 'Rogers',
      locked: false,
      emailValidated: false,
    },
  });

export type UserInfoContextState = {
  data?: UserInfo;
  isLoading: boolean;
  error?: unknown;
};

const UserInfoContext = React.createContext<UserInfoContextState | null>(null);

export function useUserInfo(): UserInfoContextState {
  const contextState = useContext(UserInfoContext);
  if (contextState === null) {
    throw new Error('useUserInfo must be used with a UserInfoProvider');
  }
  return contextState;
}

export const UserInfoProvider: React.FC<{ id: string }> = ({
  id,
  children,
}) => {
  const [state, setState] = useState<UserInfoContextState>({ isLoading: true });

  useEffect(() => {
    const fetchUser = async (): Promise<{ status: number; data: UserInfo }> => {
      return mockApiCall();
    };
    setState({ isLoading: true });
    fetchUser().then(({ data }) => setState({ isLoading: false, data }));
  }, [id]);

  return (
    <UserInfoContext.Provider value={state}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const TestUserInfoProvider: React.FC<{
  value: UserInfoContextState;
}> = props => (
  <UserInfoContext.Provider value={props.value}>
    {props.children}
  </UserInfoContext.Provider>
);
