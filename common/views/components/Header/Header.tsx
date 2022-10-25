import { FunctionComponent, useState } from 'react';
import styled from 'styled-components';
import { font } from '../../../utils/classnames';
import WellcomeCollectionBlack from '../../../icons/wellcome_collection_black';
import DesktopSignIn from './DesktopSignIn';
import MobileSignIn from './MobileSignIn';

const NavLoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${props => props.theme.media('headerMedium')`
    width: 100%;
  `}
`;

type WrapperProps = {
  isBurgerOpen: boolean;
};

const Wrapper = styled.div.attrs({
  className: 'grid',
})<WrapperProps>`
  align-items: center;
  position: relative;
  z-index: 6;
  background-color: ${props => props.theme.color('white')};
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
  height: ${props => props.theme.navHeight}px;

  ${props =>
    props.isBurgerOpen &&
    `${props.theme.mediaBetween(
      'small',
      'headerMedium'
    )(`
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      z-index: 10;
    `)}
  `}
`;

const Burger = styled.div`
  display: block;

  ${props => props.theme.media('headerMedium')`
    display: none;
  `}
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
    ${props.theme.media('headerMedium')(`
      margin-left: 0;
      flex: 0 0 auto;
      margin-right: 1.5rem;
      padding-right: 1.5rem;
      border-right: 1px solid ${props.theme.color('warmNeutral.400')};
      width: auto;
      display: block;
    `)}
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
    ${props.theme.mediaBetween(
      'small',
      'headerMedium'
    )(`
      border-top: 1px solid ${props.theme.color('warmNeutral.400')};
      height: calc(100vh - 84px);
      overflow: auto;
    `)}

    ${props.theme.media('medium')(`
      padding-left: ${props.theme.grid.m.padding + props.theme.grid.m.gutter}px;
      padding-right: ${props.theme.grid.m.padding}px;
    `)}

    ${props.theme.media('headerMedium')`
      position: static;
      display: block;
      margin-top: 0;
      padding-left: 0;
      padding-right: 0;
    `}
  `}
`;

const HeaderList = styled.ul`
  margin-left: -0.3rem;

  ${props => props.theme.media('headerMedium')`
    display: flex;
  `}
`;

const HeaderItem = styled.li`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};

  // TODO: the vw units below are tightly coupled to the
  // number of nav items and number of characters in them.
  // This is a stop-gap ahead of nav design rework.

  ${props => `
    ${props.theme.media('headerMedium')`
      border-bottom: 0;
      margin-right: calc(3vw - 20px);
    `}

    ${props.theme.mediaBetween(
      'headerMedium',
      'large'
    )(`
      font-size: 1.5vw;
    `)}

    ${props.theme.media('xlarge')`
      margin-right: 1.4rem;
    `}
  `}
`;

const HeaderLink = styled.a<{ isActive: boolean }>`
  padding: 1.4rem 0.3rem;
  display: inline-block;
  text-decoration: none;
  position: relative;
  z-index: 1;
  transition: color 400ms ease;

  ${props => props.theme.media('headerMedium')`
    padding-top: 1rem;
    padding-bottom: 1rem;
  `}

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

    ${props => props.theme.media('headerMedium')`
      bottom: 0.9rem;
    `}
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

export type NavLink = {
  href: string;
  title: string;
  siteSection?: string;
};

type Props = {
  siteSection: string | null;
  customNavLinks?: NavLink[];
  showLibraryLogin?: boolean;
};

export const links: NavLink[] = [
  {
    href: '/visit-us',
    title: 'Visit us',
    siteSection: 'visit-us',
  },
  {
    href: '/whats-on',
    title: 'What’s on',
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

export const exhibitionGuidesLinks: NavLink[] = [
  {
    href: '/guides/exhibitions',
    title: 'Exhibition guides',
    siteSection: 'exhibition-guides',
  },
];

const GridCell = styled.div.attrs({
  className: 'grid__cell',
})`
  position: relative;
`;

const Container = styled.div.attrs({
  className: 'container',
})`
  display: flex;
  align-items: center;
`;

const Header: FunctionComponent<Props> = ({
  siteSection,
  customNavLinks,
  showLibraryLogin = true,
}) => {
  const [isActive, setIsActive] = useState(false);

  return (
    <Wrapper isBurgerOpen={isActive}>
      <GridCell>
        <Container>
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
                {(customNavLinks || links).map((link, i) => (
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
                {showLibraryLogin && <MobileSignIn />}
              </HeaderList>
            </HeaderNav>
            {showLibraryLogin && <DesktopSignIn />}
          </NavLoginWrapper>
        </Container>
      </GridCell>
    </Wrapper>
  );
};

export default Header;
