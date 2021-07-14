import { FunctionComponent } from 'react';
import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import {
  useUserInfo,
  withUserInfo,
} from '@weco/identity/src/frontend/MyAccount/UserInfoContext';

const AccountLink = styled.a.attrs({
  className: classNames({
    block: true,
    [font('hnr', 5)]: true,
  }),
})``;

const SignIn: FunctionComponent = () => {
  const { user } = useUserInfo();
  return (
    <>
      {!user && (
        <>
          <AccountLink href="/account">Sign in to library account</AccountLink>
          <AccountLink
            className="block"
            href={`/pages/${prismicPageIds.register}`}
          >
            Register
          </AccountLink>
        </>
      )}
      {user && (
        <>
          <AccountLink className="block" href="/account">
            My library account
          </AccountLink>
          <AccountLink className="block" href="/account/logout">
            Sign out
          </AccountLink>
        </>
      )}
    </>
  );
};

export default withUserInfo(SignIn);
