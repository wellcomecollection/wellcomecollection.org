import { FunctionComponent } from 'react';
import {
  useUserInfo,
  withUserInfo,
} from '@weco/identity/src/frontend/MyAccount/UserInfoContext';
import { useRouter } from 'next/router';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import styled from 'styled-components';

const SignInContainer = styled.div`
  display: flex;
`;

const StyledSignIn = styled(Space).attrs({
  as: 'div',
  className: font('hnm', 5),
})`
  margin-left: auto;
  background: ${props => props.theme.color('smoke')};
`;

const SignIn: FunctionComponent = () => {
  const { user, isLoading } = useUserInfo();
  const router = useRouter();
  return router.pathname !== '/item' ? (
    <Layout12>
      <SignInContainer>
        <StyledSignIn
          h={{
            size: 'l',
            properties: ['padding-right', 'padding-left'],
          }}
          v={{
            size: 'm',
            properties: ['padding-top', 'padding-bottom'],
          }}
        >
          {!user && !isLoading && (
            <>
              <a href="/account">Library account sign in</a> |{' '}
              <a href="/pages/X_2eexEAACQAZLBi">Register</a>
            </>
          )}
          {user && (
            <>
              <a href="/account">My library account</a> |{' '}
              <a href="/account/logout">Sign out</a>
            </>
          )}
        </StyledSignIn>
      </SignInContainer>
    </Layout12>
  ) : null;
};

export default withUserInfo(SignIn);
