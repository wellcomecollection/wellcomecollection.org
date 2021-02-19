import React, { useContext, useEffect, useState } from 'react';
import { UserInfo } from '../../types/UserInfo';

export const mockUser: UserInfo = {
  firstName: 'Steve',
  lastName: 'Rogers',
  locked: false,
  emailValidated: true,
  barcode: '1234567',
  patronId: 7654321,
};

const mockApiCall = () =>
  Promise.resolve({
    status: 200,
    user: mockUser,
  });

export type UserInfoContextState = {
  user?: UserInfo;
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
    const fetchUser = async (): Promise<{ status: number; user: UserInfo }> => {
      return mockApiCall();
    };
    setState({ isLoading: true });
    fetchUser().then(({ user }) => setState({ isLoading: false, user }));
  }, [id]);

  return (
    <UserInfoContext.Provider value={state}>
      {children}
    </UserInfoContext.Provider>
  );
};

export const TestUserInfoProvider: React.FC<{
  value: UserInfoContextState;
}> = props => {
  return (
    <UserInfoContext.Provider value={props.value}>
      {props.children}
    </UserInfoContext.Provider>
  );
};
