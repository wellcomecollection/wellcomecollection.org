import { FunctionComponent } from 'react';
import styled from 'styled-components';
import { font } from '@weco/common/utils/classnames';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { useUser } from '../UserProvider/UserProvider';
import { user as userIcon } from '@weco/common/icons';
import { trackGaEvent } from '@weco/common/utils/ga';

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

      &:after {
        position: absolute;
        right: 0;
        content: '|';
      }
    }

    &:last-of-type {
      &:after {
        display: none;
      }
    }
  }
`;

const MobileSignIn: FunctionComponent = () => {
  const { user } = useUser();
  return (
    <StyledComponent>
      <Space
        h={{ size: 's', properties: ['margin-right'] }}
        className={font('intr', 4)}
      >
        <Icon icon={userIcon} matchText={true} />
      </Space>
      {!user && (
        <a
          href="/account/api/auth/login"
          onClick={() => {
            trackGaEvent({
              category: 'library_account',
              action: 'login',
              label: window.location.pathname,
            });
          }}
        >
          Sign in to your library account
        </a>
      )}
      {user && (
        <>
          <a
            href="/account"
            onClick={() => {
              trackGaEvent({
                category: 'library_account',
                action: 'view',
                label: window.location.pathname,
              });
            }}
          >
            Library account
          </a>
          <a href="/account/api/auth/logout">Sign out</a>
        </>
      )}
    </StyledComponent>
  );
};

export default MobileSignIn;
