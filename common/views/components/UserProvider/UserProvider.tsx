import { createContext, FC, useContext, useState } from 'react';
import { UserInfo } from '../../../model/user';
import { useAbortSignalEffect } from '../../../hooks/useAbortSignalEffect';
import { useToggles } from '../../../server-data/Context';

export type State = 'initial' | 'loading' | 'signedin' | 'signedout' | 'failed';
type Props = {
  user: UserInfo | undefined;
  state: State;
  enabled: boolean;
  reload: () => void;
  _updateUserState: (update: Partial<UserInfo>) => void;
};

export const UserContext = createContext<Props>({
  user: undefined,
  state: 'initial',
  enabled: false,
  reload: () => void 0,
  _updateUserState: () => void 0,
});

export function useUser(): Props {
  const contextState = useContext(UserContext);
  return contextState;
}

const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserInfo>();
  const [state, setState] = useState<State>('initial');

  const updateUserState = (update: Partial<UserInfo>) =>
    setUser(user => (user ? { ...user, ...update } : undefined));

  const fetchUser = async (abortSignal?: AbortSignal) => {
    setState('loading');
    try {
      const resp = await fetch('/account/api/users/me', {
        signal: abortSignal,
      });
      switch (resp.status) {
        case 401:
          setState('signedout');
          break;

        case 200:
          const data = await resp.json();
          setState('signedin');
          setUser(data);
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
      value={{
        user,
        state,
        // We can remove this once we're untoggled
        enabled: true,
        reload: fetchUser,
        // This is intended for "internal" use only in the identity app
        _updateUserState: updateUserState,
      }}
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

  return toggles.enableRequesting || forceEnable ? (
    <UserProvider>{children}</UserProvider>
  ) : (
    <>{children}</>
  );
};

export default ToggledUserProvider;
