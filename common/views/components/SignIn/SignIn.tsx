import { FC } from 'react';
import { UserInfo } from '../../../model/user';
type Props = {
  user?: UserInfo;
};

const SignIn: FC<Props> = ({ user }) => {
  return (
    <>
      {!user && <a href="/account/login">Sign in to your library account</a>}
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
