import { FC } from 'react';
import styled from 'styled-components';
import { font, classNames } from '../../../utils/classnames';
import { useUser } from '../UserProvider/UserProvider';
import DropdownButton from '../DropdownButton/DropdownButton';
import { BorderlessLink } from '../BorderlessClickable/BorderlessClickable';
import AlignFont from '../styled/AlignFont';
import { user } from '../../../icons';

const LinkList = styled.div`
  a {
    display: block;
    text-decoration: none;
    margin-bottom: 16px;
    &:hover {
      text-decoration: underline;
    }
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const DesktopSignIn: FC = () => {
  const { state, user } = useUser();

  return state === 'initial' ? null : (
    <>
      {state === 'signedout' && (
        <>
          <span className="display-none headerLarge-display-block">
            <BorderlessLink
              iconLeft={user}
              text={
                <span
                  className={classNames({
                    [font('hnr', 6)]: true,
                  })}
                >
                  Library sign in
                </span>
              }
              href="/account"
            />
          </span>
          <span className="display-none headerMedium-display-block headerLarge-display-none">
            <DropdownButton
              label=""
              iconLeft={user}
              id="signedin-dropdown"
              buttonType="borderless"
            >
              <span
                className={classNames({
                  [font('hnr', 6)]: true,
                })}
              >
                <AlignFont>
                  <a
                    href="/account"
                    onClick={event => {
                      // This is a very hacked together piece of work that allows us to read this cookie
                      // and respond to it in the identity app
                      event.preventDefault();
                      document.cookie = `returnTo=${window.location.pathname}; path=/`;
                      window.location.href = event.currentTarget.href;
                    }}
                  >
                    Sign in to your library account
                  </a>
                </AlignFont>
              </span>
            </DropdownButton>
          </span>
        </>
      )}
      {state === 'signedin' && user && (
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
          iconLeft={user}
          id="signedin-dropdown"
          buttonType="borderless"
        >
          <span
            className={classNames({
              [font('hnr', 6)]: true,
            })}
          >
            <AlignFont>
              <LinkList>
                <a href="/account">Library account</a>
                <a href="/account/logout">Sign out</a>
              </LinkList>
            </AlignFont>
          </span>
        </DropdownButton>
      )}
    </>
  );
};

export default DesktopSignIn;
