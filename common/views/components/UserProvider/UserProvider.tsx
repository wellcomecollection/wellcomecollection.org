import { createContext, FunctionComponent, useContext, useState } from 'react';
import {
  auth0UserProfileToUserInfo,
  isFullAuth0Profile,
  UserInfo,
} from '../../../model/user';
import { useAbortSignalEffect } from '../../../hooks/useAbortSignalEffect';

export type State = 'initial' | 'loading' | 'signedin' | 'signedout' | 'failed';

type Props = {
  user: UserInfo | undefined;
  state: State;
  reload: (abortSignal?: AbortSignal) => Promise<void>;
};

const defaultUserContext: Props = {
  user: undefined,
  state: 'initial',
  reload: async () => void 0,
};

export const UserContext = createContext<Props>(defaultUserContext);

export function useUser(): Props {
  const contextState = useContext(UserContext);
  return contextState;
}

const UserProvider: FunctionComponent = ({ children }) => {
  const [user, setUser] = useState<UserInfo>();
  const [state, setState] = useState<State>('initial');

  const fetchUser = async (abortSignal?: AbortSignal, refetch = false) => {
    setState('loading');
    try {
      let profileUrl = '/account/api/auth/me';
      if (refetch) {
        profileUrl += '?refetch';
      }
      const resp = await fetch(profileUrl, {
        signal: abortSignal,
      });
      switch (resp.status) {
        case 401:
          setState('signedout');
          break;

        case 200:
          const data = await resp.json();
          if (isFullAuth0Profile(data)) {
            // There is a race condition here where the cancel can happen
            // after the fetch has finished but before the response has been deserialised
            if (!abortSignal?.aborted) {
              setUser(auth0UserProfileToUserInfo(data));
              setState('signedin');
            }
          } else {
            console.error(
              'Profile in session did not contain all necessary claims',
              data
            );
            setState('failed');
          }
          break;

        default:
          console.error('Failed fetching user', resp.status);
          setState('failed');
      }
    } catch (e) {
      if (!abortSignal?.aborted) {
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
      value={{
        user,
        state,
        reload: (abortSignal?: AbortSignal) => fetchUser(abortSignal, true),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
