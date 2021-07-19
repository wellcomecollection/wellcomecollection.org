import { FunctionComponent } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import { UserInfo } from '@weco/identity/src/frontend/hooks/useUserInfo';
type Props = {
  user?: UserInfo;
};

const SignIn: FunctionComponent<Props> = ({ user }) => {
  return (
    <div
      className={classNames({
        [font('hnr', 6)]: true,
      })}
    >
      {!user && (
        <>
          <a href="/account">Sign in to Library account</a>
        </>
      )}
      {user && (
        <>
          <a href="/account">Library account details</a>
          <a href="/account/logout">Sign out</a>
        </>
      )}
    </div>
  );
};

export default SignIn;
