import { FunctionComponent } from 'react';
import { UserInfo } from '@weco/identity/src/frontend/hooks/useUserInfo';
type Props = {
  user?: UserInfo;
};

const SignIn: FunctionComponent<Props> = ({ user }) => {
  return (
    <>
      {!user && (
        <a
          href="/account"
          onClick={event => {
            // This is a very hacked together piece of work that allows us to read this cookie
            // and respond to it in the identity app
            event.preventDefault();
            document.cookie = `returnTo=${window.location.pathname}; path=/`;
            window.location.href = event.currentTarget.href;
          }}
        >
          Sign in to your library account
        </a>
      )}
      {user && (
        <>
          <a href="/account">Library account</a>
          <a href="/account/logout">Sign out</a>
        </>
      )}
    </>
  );
};

export default SignIn;
