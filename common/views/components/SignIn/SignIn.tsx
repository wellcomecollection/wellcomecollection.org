import { FunctionComponent } from 'react';
import { UserInfo } from '../../../model/user';
type Props = {
  user?: UserInfo;
};

const SignIn: FunctionComponent<Props> = ({ user }) => {
  return (
    <>
      {!user && <a href="/account">Sign in to your library account</a>}
      {user && (
        <>
          <a href="/account">Library account</a>
          <a href="/account/api/auth/logout">Sign out</a>
        </>
      )}
    </>
  );
};

export default SignIn;
