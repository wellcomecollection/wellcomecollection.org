import { FunctionComponent } from 'react';
import { font, classNames } from '@weco/common/utils/classnames';
import {
  useUserInfo,
  withUserInfo,
} from '@weco/identity/src/frontend/MyAccount/UserInfoContext';

const SignIn: FunctionComponent = () => {
  const { user } = useUserInfo();
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

export default withUserInfo(SignIn);
