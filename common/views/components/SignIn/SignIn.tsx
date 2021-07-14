import { FunctionComponent } from 'react';
import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';
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
        [font('hnr', 5)]: true,
      })}
    >
      {!user && (
        <>
          <a href="/account">Sign in to library account</a>
          <a href={`/pages/${prismicPageIds.register}`}>Register</a>
        </>
      )}
      {user && (
        <>
          <a href="/account">My library account</a>
          <a href="/account/logout">Sign out</a>
        </>
      )}
    </div>
  );
};

export default withUserInfo(SignIn);
