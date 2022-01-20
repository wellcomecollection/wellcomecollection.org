import { FC } from 'react';
import styled from 'styled-components';
import { font, classNames } from '../../../utils/classnames';
import { useUser } from '../UserProvider/UserProvider';
import DropdownButton from '../DropdownButton/DropdownButton';
import Space from '../styled/Space';
import { BorderlessLink } from '../BorderlessClickable/BorderlessClickable';
import { user as userIcon } from '../../../icons';
import { useLoginURLWithReturnToCurrent } from '../../../utils/useLoginURLWithReturnToCurrent';

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
  const loginURL = useLoginURLWithReturnToCurrent();

  return state === 'initial' || state === 'loading' ? (
    <span className="display-none headerMedium-display-block">
      <BorderlessLink iconLeft={userIcon} text={null} href="/account" />
    </span>
  ) : (
    <>
      {state === 'signedout' && (
        <>
          <span className="display-none headerLarge-display-block">
            <BorderlessLink
              iconLeft={userIcon}
              text={
                <span
                  className={classNames({
                    [font('hnr', 6)]: true,
                  })}
                >
                  Library sign in
                </span>
              }
              href={loginURL}
            />
          </span>
          <span
            className={`display-none headerMedium-display-block headerLarge-display-none ${font(
              'hnr',
              6
            )}`}
          >
            <DropdownButton
              label=""
              iconLeft={userIcon}
              id="signedin-dropdown"
              buttonType="borderless"
            >
              <a href={loginURL}>Sign in to your library account</a>
            </DropdownButton>
          </span>
        </>
      )}
      {state === 'signedin' && user && (
        <span className="display-none headerMedium-display-block">
          <DropdownButton
            label={
              <span
                className={classNames({
                  [font('hnr', 6)]: true,
                })}
              >
                {user.firstName.charAt(0).toLocaleUpperCase()}
                {user.lastName.charAt(0).toLocaleUpperCase()}
              </span>
            }
            iconLeft={userIcon}
            id="signedin-dropdown"
            buttonType="borderless"
          >
            <span
              className={classNames({
                [font('hnr', 6)]: true,
              })}
            >
              <AccountA as="a" href="/account">
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
