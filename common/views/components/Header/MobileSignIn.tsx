import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { useUserContext } from '@weco/common/contexts/UserContext';
import { user as userIcon } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

const StyledComponent = styled.div.attrs({
  className: font('intr', 5),
})`
  ${props => props.theme.media('headerMedium')`
    display: none;
  `}
  display: flex;
  margin-top: 1.4rem;

  a {
    position: relative;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }

    &:first-of-type {
      margin-right: 1em;
      padding-right: 1em;

      &::after {
        position: absolute;
        right: 0;
        content: '|';
      }
    }

    &:last-of-type {
      &::after {
        display: none;
      }
    }
  }
`;

const MobileSignIn: FunctionComponent = () => {
  const { user } = useUserContext();
  return (
    <StyledComponent>
      <Space
        $h={{ size: 's', properties: ['margin-right'] }}
        className={font('intr', 4)}
      >
        <Icon icon={userIcon} matchText={true} />
      </Space>
      {!user && (
        <a href="/account/auth/login" data-gtm-trigger="library_account_login">
          Sign in to your library account
        </a>
      )}
      {user && (
        <>
          <a href="/account">Library account</a>
          <a href="/account/auth/logout">Sign out</a>
        </>
      )}
    </StyledComponent>
  );
};

export default MobileSignIn;
