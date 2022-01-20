import { FC } from 'react';
import styled from 'styled-components';
import { classNames, font } from '../../../utils/classnames';
import { respondTo } from '../../themes/mixins';
import Space from '../styled/Space';
import Icon from '../Icon/Icon';
import { useUser } from '../UserProvider/UserProvider';
import { user as userIcon } from '../../../icons';
import { useLoginURLWithReturnToCurrent } from '../../../utils/useLoginURLWithReturnToCurrent';

const StyledComponent = styled.div.attrs({
  className: classNames({
    [font('hnr', 5)]: true,
  }),
})`
  ${respondTo(
    'headerMedium',
    `
    display: none;
  `
  )}
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

const MobileSignIn: FC = () => {
  const { user } = useUser();
  const loginURL = useLoginURLWithReturnToCurrent();
  return (
    <StyledComponent>
      <Space
        h={{ size: 's', properties: ['margin-right'] }}
        className={classNames({
          [font('hnr', 4)]: true,
        })}
      >
        <Icon icon={userIcon} matchText={true} />
      </Space>
      {!user && <a href={loginURL}>Sign in to your library account</a>}
      {user && (
        <>
          <a href="/account">Library account</a>
          <a href="/account/api/auth/logout">Sign out</a>
        </>
      )}
    </StyledComponent>
  );
};

export default MobileSignIn;
