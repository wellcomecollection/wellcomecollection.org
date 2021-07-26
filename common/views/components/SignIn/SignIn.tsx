import { FunctionComponent } from 'react';
import { UserInfo } from '@weco/identity/src/frontend/hooks/useUserInfo';
type Props = {
  user?: UserInfo;
};

const SignIn: FunctionComponent<Props> = ({ user }) => {
  return (
    <>
      {!user && <a href="/account">Sign in to Library account</a>}
      {user && (
        <>
          <a href="/account">Library account details</a>
          <a href="/account/logout">Sign out</a>
        </>
      )}
    </>
  );
};

export default SignIn;
