import React, { useContext, useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { UserInfo } from '../../types/UserInfo';

export type UserInfoContextState = {
  user?: UserInfo;
  isLoading: boolean;
  error?: { message: string };
  refetch?: () => void;
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
  const router = useRouter();
  const { userId } = router.query;

  const fetchUser = async (): Promise<void> => {
    setState({ isLoading: true });
    return fetch(`/api/user/${userId}`)
      .then(res => res.json())
      .then(user => setState({ isLoading: false, user }))
      .catch(error => setState({ isLoading: false, error }));
  };

  useEffect(() => {
    fetchUser();
  }, [userId]);

  return (
    <UserInfoContext.Provider value={{ ...state, refetch: fetchUser }}>
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
