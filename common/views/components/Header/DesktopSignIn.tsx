import { FunctionComponent } from 'react';
import styled from 'styled-components';

import { user as userIcon } from '@weco/common/icons';
import { font } from '@weco/common/utils/classnames';
import { BorderlessLink } from '@weco/common/views/components/BorderlessClickable';
import Button from '@weco/common/views/components/Buttons';
import Space from '@weco/common/views/components/styled/Space';
import { useUser } from '@weco/common/views/components/UserProvider';

type AccountAProps = {
  $last?: true;
};
const AccountA = styled(Space).attrs<AccountAProps>(props => ({
  $v: props.$last ? undefined : { size: 's', properties: ['margin-bottom'] },
}))`
  display: block;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const SignedOutWrapper = styled.span.attrs({
  className: 'display-none headerMedium-display-block' + ' ' + font('intr', 6),
})`
  /* Hack to minimise the margins between both icons when signed out */
  button span span:first-child {
    margin-right: 0;
  }
`;

const DesktopSignIn: FunctionComponent = () => {
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
        <SignedOutWrapper>
          <Button
            variant="DropdownButton"
            label=""
            ariaLabel="library account sign in"
            iconLeft={userIcon}
            id="signedin-dropdown"
            buttonType="borderless"
          >
            <a
              href="/account/api/auth/login"
              data-gtm-trigger="library_account_login"
            >
              Sign in to your library account
            </a>
          </Button>
        </SignedOutWrapper>
      )}
      {state === 'signedin' && user && (
        <span className="display-none headerMedium-display-block">
          <Button
            variant="DropdownButton"
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
              <AccountA as="a" href="/account">
                Library account
              </AccountA>
              <AccountA as="a" href="/account/api/auth/logout" $last>
                Sign out
              </AccountA>
            </span>
          </Button>
        </span>
      )}
    </>
  );
};

export default DesktopSignIn;
