import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { initialState, userInfoReducer, UserInfoState } from './reducer';
import { UserInfo } from '@weco/common/model/user';
import { withAppPathPrefix } from '../../../utility/app-path-prefix';

type UserInfoContext = UserInfoState & {
  isLoading: boolean;
  fetch: () => void;
  update: (newUserInfo: Partial<UserInfo>) => void;
  cancel: () => void;
};

const UserInfoContext = React.createContext<UserInfoContext | null>(null);

export function useUserInfo(): UserInfoContext {
  const contextState = useContext(UserInfoContext);
  if (contextState === null) {
    throw new Error('useUserInfo must be used with a UserInfoProvider');
  }
  return contextState;
}

export const UserInfoProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(userInfoReducer, initialState);

  useEffect(() => {
    dispatch({ type: 'FETCH' });
  }, []);

  useEffect(() => {
    if (state.status === 'loading') {
      let cancelled = false;
      axios
        .get<UserInfo>(withAppPathPrefix('/api/users/me'))
        .then(({ data }) => {
          if (cancelled) return;
          dispatch({ type: 'RESOLVE', payload: data });
        })
        .catch(error => {
          if (cancelled) return;
          dispatch({ type: 'REJECT', error });
        });
      return () => {
        cancelled = true;
      };
    }
  }, [state.status]);

  const update = (newUserInfo: Partial<UserInfo>) =>
    dispatch({ type: 'UPDATE', payload: newUserInfo });

  return (
    <UserInfoContext.Provider
      value={{
        ...state,
        isLoading: state.status === 'loading',
        fetch: () => dispatch({ type: 'FETCH' }),
        cancel: () => dispatch({ type: 'CANCEL' }),
        update,
      }}
    >
      {children}
    </UserInfoContext.Provider>
  );
};

export const withUserInfo = <P extends Record<string, unknown>>(
  WrappedComponent: React.ComponentType<P>
): React.FC<P> => {
  const displayName =
    WrappedComponent.displayName || WrappedComponent.name || 'Component';

  const ComponentWithUserInfo = (props: P) => (
    <UserInfoProvider>
      <WrappedComponent {...props} />
    </UserInfoProvider>
  );

  ComponentWithUserInfo.displayName = `withUserInfo(${displayName})`;

  return ComponentWithUserInfo;
};
