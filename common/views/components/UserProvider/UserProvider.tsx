import { createContext, FC, useContext, useEffect, useState } from 'react';
import { UserInfo } from '../../../model/user';
import TogglesContext from '../TogglesContext/TogglesContext';

type State = 'initial' | 'loading' | 'signedin' | 'signedout' | 'failed';
type Props = {
  user: UserInfo | undefined;
  state: State;
  enabled: boolean;
  reload: () => void;
};

export const UserContext = createContext<Props>({
  user: undefined,
  state: 'initial',
  enabled: false,
  reload: () => {
    // no-op - we could probably try fill this out, but I can't really see the benefit
  },
});

export function useUser(): Props {
  const contextState = useContext(UserContext);
  return contextState;
}

const UserProvider: FC = ({ children }) => {
  const [user, setUser] = useState<UserInfo>();
  const [state, setState] = useState<State>('initial');

  const fetchUser = async () => {
    setState('loading');
    try {
      const resp = await fetch('/account/api/users/me');

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
          setState('failed');
      }
    } catch (e) {
      setState('failed');
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <UserContext.Provider
      value={{
        user,
        state,
        // We can remove this once we're untoggled
        enabled: true,
        reload: fetchUser,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

const ToggledUserProvider: FC = ({ children }) => {
  const toggles = useContext(TogglesContext);

  return toggles.enableRequesting ? (
    <UserProvider>{children}</UserProvider>
  ) : (
    <>{children}</>
  );
};

export default ToggledUserProvider;
