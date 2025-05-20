import { useUser } from '@auth0/nextjs-auth0';
import {
  createContext,
  FunctionComponent,
  PropsWithChildren,
  useContext,
  useState,
} from 'react';

import { useAbortSignalEffect } from '@weco/common/hooks/useAbortSignalEffect';
import {
  auth0UserProfileToUserInfo,
  isFullAuth0Profile,
  UserInfo,
} from '@weco/common/model/user';

export type State = 'initial' | 'loading' | 'signedin' | 'signedout' | 'failed';

type Props = {
  user?: UserInfo;
  userIsStaffWithRestricted: boolean;
  state: State;
  reload: (abortSignal?: AbortSignal) => Promise<void>;
};

const defaultUserContext: Props = {
  user: undefined,
  userIsStaffWithRestricted: false,
  state: 'initial',
  reload: async () => undefined,
};

const UserContext = createContext<Props>(defaultUserContext);

export function useUserContext(): Props {
  const contextState = useContext(UserContext);
  return contextState;
}

export const UserContextProvider: FunctionComponent<PropsWithChildren> = ({
  children,
}) => {
  const { user: auth0user } = useUser();
  console.log({ auth0user }); // TODO remove this before merge
  const [user, setUser] = useState<UserInfo>();
  const [userIsStaffWithRestricted, setUserIsStaffWithRestricted] =
    useState(false);
  const [state, setState] = useState<State>('initial');

  const fetchUser = async (abortSignal?: AbortSignal, refetch = false) => {
    setState('loading');
    try {
      let profileUrl = '/account/auth/profile';
      if (refetch) {
        profileUrl += '?refetch';
      }
      const resp = await fetch(profileUrl, {
        signal: abortSignal,
      });

      switch (resp.status) {
        case 204:
          setState('signedout');
          break;

        case 200: {
          const data = await resp.json();
          if (isFullAuth0Profile(data)) {
            // There is a race condition here where the cancel can happen
            // after the fetch has finished but before the response has been deserialised
            if (!abortSignal?.aborted) {
              const userData = auth0UserProfileToUserInfo(data);
              setUser(userData);
              setUserIsStaffWithRestricted(
                userData?.role === 'StaffWithRestricted'
              );
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
        }

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
        userIsStaffWithRestricted,
        state,
        reload: (abortSignal?: AbortSignal) => fetchUser(abortSignal, true),
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;
