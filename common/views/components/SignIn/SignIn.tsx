import { FunctionComponent } from 'react';
import {
  useUserInfo,
  withUserInfo,
} from '@weco/identity/src/frontend/MyAccount/UserInfoContext';
import { useRouter } from 'next/router';
import { font } from '../../../utils/classnames';
import Space from '../styled/Space';
import Layout12 from '../Layout12/Layout12';
import styled from 'styled-components';

const SignInContainer = styled.div`
  display: flex;
`;

const StyledSignIn = styled(Space).attrs({
  className: font('hnm', 5),
  h: {
    size: 'l',
    properties: ['padding-right', 'padding-left'],
  },
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  }
})`
  margin-left: auto;
  background: ${props => props.theme.color('smoke')};
`;

const SignIn: FunctionComponent = () => {
  const { user, isLoading } = useUserInfo();
  const router = useRouter();
  return router?.pathname !== '/item'
    ? (!isLoading && (
        <Layout12>
          <SignInContainer>
            <StyledSignIn>
              {!user && (
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
      )) ||
        null
    : null;
};

export default withUserInfo(SignIn);
