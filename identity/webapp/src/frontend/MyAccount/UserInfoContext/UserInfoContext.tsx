import React, { useContext, useEffect, useReducer } from 'react';
import axios from 'axios';
import { initialState, userInfoReducer, UserInfoState } from './reducer';
import { UserInfo } from './UserInfo.interface';

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

  const withPrefix = (path: string) => {
    const root = typeof document !== 'undefined' ? document.getElementById('root') : undefined;
    return `${(root && root.getAttribute('data-context-path')) || ''}${path}`;
  };

  useEffect(() => {
    dispatch({ type: 'FETCH' });
  }, []);

  useEffect(() => {
    if (state.status === 'loading') {
      let cancelled = false;
      axios
        .get<UserInfo>(withPrefix('/api/users/me'))
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

  const update = (newUserInfo: Partial<UserInfo>) => dispatch({ type: 'UPDATE', payload: newUserInfo });

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
