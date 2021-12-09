import { createContext, FC, useContext, useState } from 'react';
import {
  Auth0UserProfile,
  auth0UserProfileToUserInfo,
  UserInfo,
} from '../../../model/user';
import { useAbortSignalEffect } from '../../../hooks/useAbortSignalEffect';
import { useToggles } from '../../../server-data/Context';

export type State = 'initial' | 'loading' | 'signedin' | 'signedout' | 'failed';
type Props = {
  enabled: boolean;
  user: UserInfo | undefined;
  state: State;
  reload: () => void;
  _updateUserState: (update: Partial<UserInfo>) => void;
};

const defaultUserContext: Props = {
  enabled: false,
  user: undefined,
  state: 'initial',
  reload: () => void 0,
  _updateUserState: () => void 0,
};

export const UserContext = createContext<Props>(defaultUserContext);

export function useUser(): Props {
  const contextState = useContext(UserContext);
  return contextState;
}

const UserProvider: FC<{ enabled: boolean }> = ({ children, enabled }) => {
  const [user, setUser] = useState<UserInfo>();
  const [state, setState] = useState<State>('initial');

  const updateUserState = (update: Partial<UserInfo>) =>
    setUser(user => (user ? { ...user, ...update } : undefined));

  const fetchUser = async (abortSignal?: AbortSignal, refresh = false) => {
    setState('loading');
    try {
      let profileUrl = '/account/api/auth/me';
      if (refresh) {
        profileUrl += '?refresh=true';
      }
      const resp = await fetch(profileUrl, {
        signal: abortSignal,
      });
      switch (resp.status) {
        case 401:
          setState('signedout');
          break;

        case 200:
          const data: Auth0UserProfile = await resp.json();
          setState('signedin');
          setUser(auth0UserProfileToUserInfo(data));
          break;

        default:
          console.error('Failed fetching user', resp.status);
          setState('failed');
      }
    } catch (e) {
      if (e.name !== 'AbortError') {
        console.error('Failed fetching user', e);
        setState('failed');
      }
    }
  };

  useAbortSignalEffect(signal => {
    fetchUser(signal);
  }, []);

  return (
    <UserContext.Provider
      value={
        enabled
          ? {
              enabled,
              user,
              state,
              reload: () => fetchUser(undefined, true),
              // This is intended for "internal" use only in the identity app
              _updateUserState: updateUserState,
            }
          : defaultUserContext
      }
    >
      {children}
    </UserContext.Provider>
  );
};

const ToggledUserProvider: FC<{ forceEnable?: boolean }> = ({
  children,
  forceEnable,
}) => {
  const toggles = useToggles();
  return (
    <UserProvider enabled={Boolean(toggles.enableRequesting || forceEnable)}>
      {children}
    </UserProvider>
  );
};

export default ToggledUserProvider;
