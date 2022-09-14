import { FC } from 'react';
import styled from 'styled-components';
import { font } from '../../../utils/classnames';
import { useUser } from '../UserProvider/UserProvider';
import DropdownButton from '../DropdownButton/DropdownButton';
import Space from '../styled/Space';
import { BorderlessLink } from '../BorderlessClickable/BorderlessClickable';
import { user as userIcon } from '../../../icons';
import { trackEvent } from '../../../utils/ga';

type AccountAProps = {
  last?: true;
};
const AccountA = styled(Space).attrs<AccountAProps>(props => ({
  v: props.last ? undefined : { size: 's', properties: ['margin-bottom'] },
}))<AccountAProps>`
  display: block;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const DesktopSignIn: FC = () => {
  const { state, user } = useUser();

  return state === 'initial' || state === 'loading' ? (
    <span className="display-none headerMedium-display-block">
      <BorderlessLink
        iconLeft={userIcon}
        text="Library account"
        isTextHidden={true}
        href="/account"
      />
    </span>
  ) : (
    <>
      {state === 'signedout' && (
        <>
          <span className="display-none headerLarge-display-block">
            <BorderlessLink
              iconLeft={userIcon}
              text={<span className={font('intr', 6)}>Library sign in</span>}
              href="/account/api/auth/login"
              onClick={() => {
                trackEvent({
                  category: 'library_account',
                  action: 'login',
                  label: window.location.pathname,
                });
              }}
            />
          </span>
          <span
            className={`display-none headerMedium-display-block headerLarge-display-none ${font(
              'intr',
              6
            )}`}
          >
            <DropdownButton
              label=""
              iconLeft={userIcon}
              id="signedin-dropdown"
              buttonType="borderless"
            >
              <a href="/account/api/auth/login">
                Sign in to your library account
              </a>
            </DropdownButton>
          </span>
        </>
      )}
      {state === 'signedin' && user && (
        <span className="display-none headerMedium-display-block">
          <DropdownButton
            label={
              <span className={font('intr', 6)}>
                {user.firstName.charAt(0).toLocaleUpperCase()}
                {user.lastName.charAt(0).toLocaleUpperCase()}
              </span>
            }
            iconLeft={userIcon}
            id="signedin-dropdown"
            buttonType="borderless"
          >
            <span className={font('intr', 6)}>
              <AccountA
                as="a"
                onClick={() => {
                  trackEvent({
                    category: 'library_account',
                    action: 'view',
                    label: window.location.pathname,
                  });
                }}
                href="/account"
              >
                Library account
              </AccountA>
              <AccountA as="a" href="/account/api/auth/logout" last>
                Sign out
              </AccountA>
            </span>
          </DropdownButton>
        </span>
      )}
    </>
  );
};

export default DesktopSignIn;
