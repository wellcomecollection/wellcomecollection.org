import { FunctionComponent, useState } from 'react';
import { font, classNames } from '../../../utils/classnames';
import WellcomeCollectionBlack from '../../../icons/wellcome_collection_black';
import styled from 'styled-components';
import { respondBetween, respondTo } from '@weco/common/views/themes/mixins';
import DropdownButton from '@weco/common/views/components/DropdownButton/DropdownButton';
import Icon from '@weco/common/views/components/Icon/Icon';
import SignIn from '@weco/common/views/components/SignIn/SignIn';
import Space from '@weco/common/views/components/styled/Space';
import {
  useUserInfo,
  withUserInfo,
} from '@weco/identity/src/frontend/MyAccount/UserInfoContext';

const FreeStickerPortal = styled.div.attrs<{ isHidden: boolean }>(props => ({
  id: 'free-sticker-portal',
  className: classNames({
    'is-hidden-s': props.isHidden,
  }),
}))<{ isHidden: boolean }>`
  position: absolute;
  right: ${props => props.theme.grid.s.gutter}px;
  top: 100%;
  z-index: 83;

  ${props => props.theme.media.medium`
    right: 100px;
  `}
`;

const NavLoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${respondTo(
    'headerMedium',
    `
    width: 100%;
  `
  )}
`;

const MobileLogin = styled.div.attrs({
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

const DesktopLogin = styled.div.attrs({
  className: classNames({
    [font('hnr', 6)]: true,
  }),
})`
  z-index: 84;
  display: none;
  transform: translateY(4px);

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

  ${respondTo(
    'headerMedium',
    `
    display: block;
  `
  )}
`;

type WrapperProps = {
  isBurgerOpen: boolean;
  navHeight: number;
};
const Wrapper = styled.div.attrs({
  className: classNames({
    'grid bg-white': true,
  }),
})<WrapperProps>`
  position: relative;
  z-index: 1;
  border-bottom: 1px solid ${props => props.theme.color('pumice')};

  ${props =>
    props.isBurgerOpen &&
    `${respondBetween(
      'small',
      'headerMedium',
      `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    `
    )}
  `}
  height: ${props => props.navHeight}px;
`;

const Burger = styled.div`
  display: block;

  ${respondTo(
    'headerMedium',
    `
    display: none;
  `
  )}
`;

const BurgerTrigger = styled.a<{ isActive: boolean }>`
  position: relative;
  width: 1.2rem;
  height: 0.9rem;
  display: block;

  // TODO: replace with svg-sprite icon
  span {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: ${props => props.theme.color('black')};
    transition: transform 400ms ease;
    transform-origin: center center;

    &:nth-child(2) {
      top: 50%;
    }

    &:last-child {
      top: 100%;
    }

    ${props =>
      props.isActive &&
      `
        &:first-child {
          top: 0.5rem;
          transform: rotate(45deg);
        }

        &:nth-child(2) {
          display: none;
        }

        &:last-child {
          top: 0.5rem;
          transform: rotate(-45deg);
          bottom: auto;
        }
    `}
  }
`;

const HeaderBrand = styled.div`
  display: flex;
  flex: 1;
  // This is to account for the burger as we want it to be dead centre.
  margin-left: -20px;

  ${props => `
    ${respondTo(
      'headerMedium',
      `
      margin-left: 0;
      flex: 0 0 auto;
      margin-right: 1.5rem;
      padding-right: 1.5rem;
      border-right: 1px solid ${props.theme.color('pumice')};
      width: auto;
      display: block;
    `
    )}
  `}

  a {
    display: inline-block;
    margin: 0 auto;
  }
`;

const HeaderNav = styled.nav<{ isActive: boolean }>`
  display: ${props => (props.isActive ? 'block' : 'none')};
  background: ${props => props.theme.color('white')};
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  padding-left: ${props =>
    props.theme.grid.s.padding + props.theme.grid.s.gutter}px;
  padding-right: ${props => props.theme.grid.s.padding}px;

  ${props => `
    ${respondBetween(
      'small',
      'headerMedium',
      `
      border-top: 1px solid ${props.theme.color('pumice')};
      height: calc(100vh - 84px);
      overflow: auto;
    `
    )}
  `}


  ${props => `
    ${respondTo(
      'medium',
      `
      padding-left: ${props.theme.grid.m.padding + props.theme.grid.m.gutter}px;
      padding-right: ${props.theme.grid.m.padding}px;
    `
    )}
  `}

  ${respondTo(
    'headerMedium',
    `
    position: static;
    display: block;
    margin-top: 0;
    padding-left: 0;
    padding-right: 0;
  `
  )}

`;

const HeaderList = styled.ul`
  margin-left: -0.3rem;

  ${respondTo(
    'headerMedium',
    `
    display: flex;
  `
  )}
`;

const HeaderItem = styled.li`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};

  // TODO: the vw units below are tightly coupled to the
  // number of nav items and number of characters in them.
  // This is a stop-gap ahead of nav design rework.

  ${respondTo(
    'headerMedium',
    `
    border-bottom: 0;
    margin-right: 0.6vw;
  `
  )}

  ${respondBetween(
    'headerMedium',
    'large',
    `
    font-size: 1.5vw;
  `
  )}

  ${respondTo(
    'xlarge',
    `
    margin-right: 1.4rem;
  `
  )}
`;

const HeaderLink = styled.a<{ isActive: boolean }>`
  padding: 1.4rem 0.3rem;
  display: inline-block;
  text-decoration: none;
  position: relative;
  z-index: 1;
  transition: color 400ms ease;

  ${respondTo(
    'headerMedium',
    `
    padding-bottom: 1rem;
  `
  )}

  &:after {
    content: '';
    position: absolute;
    bottom: 1.3rem;
    height: 0.6rem;
    left: 0;
    width: 0;
    background: ${props => props.theme.color('yellow')};
    z-index: -1;
    transition: width 200ms ease;

    ${respondTo(
      'headerMedium',
      `
      bottom: 0.9rem;
    `
    )}
  }

  &:hover,
  &:focus {
    &:after {
      width: 100%;

      // Prevent iOS double-tap link issue
      // https://css-tricks.com/annoying-mobile-double-tap-link-issue/
      @media (pointer: coarse) {
        width: 0;
      }
    }
  }

  ${props =>
    props.isActive &&
    `
    &:after {
      width: 100%;
    }
  `}
`;

export const navHeight = 85;

type Props = {
  siteSection: string | null;
};

export const links = [
  {
    href: '/visit-us',
    title: 'Visit us',
    siteSection: 'visit-us',
  },
  {
    href: '/whats-on',
    title: "What's on",
    siteSection: 'whats-on',
  },
  {
    href: '/stories',
    title: 'Stories',
    siteSection: 'stories',
  },
  {
    href: '/collections',
    title: 'Collections',
    siteSection: 'collections',
  },
  {
    href: '/get-involved',
    title: 'Get involved',
    siteSection: 'get-involved',
  },
  {
    href: '/about-us',
    title: 'About us',
    siteSection: 'about-us',
  },
];

const Header: FunctionComponent<Props> = ({ siteSection }) => {
  const [isActive, setIsActive] = useState(false);
  const { user, isLoading } = useUserInfo();
  const displayName = user && `${user.firstName} ${user.lastName.slice(0, 1)}…`;

  return (
    <Wrapper navHeight={navHeight} isBurgerOpen={isActive}>
      <div
        className="relative grid__cell"
        style={{ paddingTop: '15px', paddingBottom: '15px' }}
      >
        <div className="flex flex--v-center container">
          <Burger>
            <BurgerTrigger
              isActive={isActive}
              href="#footer-nav-1"
              id="header-burger-trigger"
              aria-label="menu"
              onClick={event => {
                event.preventDefault();
                setIsActive(!isActive);
              }}
            >
              <span />
              <span />
              <span />
            </BurgerTrigger>
          </Burger>
          <HeaderBrand>
            <a href="/">
              <WellcomeCollectionBlack />
            </a>
          </HeaderBrand>
          <NavLoginWrapper>
            <HeaderNav
              isActive={isActive}
              id="header-nav"
              aria-labelledby="header-burger-trigger"
            >
              <HeaderList
                className={`plain-list ${font('wb', 5)} no-margin no-padding`}
              >
                {links.map((link, i) => (
                  <HeaderItem key={i}>
                    <HeaderLink
                      isActive={link.siteSection === siteSection}
                      href={link.href}
                      {...(link.siteSection === siteSection
                        ? { 'aria-current': true }
                        : {})}
                    >
                      {link.title}
                    </HeaderLink>
                  </HeaderItem>
                ))}
                {!isLoading && (
                  <MobileLogin>
                    <Space
                      h={{ size: 's', properties: ['margin-right'] }}
                      className={classNames({
                        [font('hnr', 4)]: true,
                      })}
                    >
                      <Icon name={'user'} matchText={true} />
                    </Space>
                    <SignIn user={user} />
                  </MobileLogin>
                )}
              </HeaderList>
            </HeaderNav>
            {!isLoading && (
              <DesktopLogin>
                <DropdownButton
                  // FIXME: If we go with this approach, the DropdownButton should probably
                  // be able to take an optional icon
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  label={
                    <div className="flex flex--v-center">
                      <div
                        style={{ transform: 'translateY(0.1em)' }}
                        className={classNames({
                          [font('hnr', 4)]: true,
                        })}
                      >
                        <Icon name={'user'} matchText={true} />
                      </div>
                      <Space
                        h={{ size: 's', properties: ['margin-left'] }}
                        className={classNames({
                          [font('hnr', 6)]: true,
                          'is-hidden-s is-hidden-m is-hidden-l': true,
                        })}
                      >
                        {displayName || 'Library sign in'}
                      </Space>
                    </div>
                  }
                  buttonType={'borderless'}
                >
                  <SignIn user={user} />
                </DropdownButton>
              </DesktopLogin>
            )}
          </NavLoginWrapper>
          <FreeStickerPortal isHidden={isActive} />
        </div>
      </div>
    </Wrapper>
  );
};

export default withUserInfo(Header);
