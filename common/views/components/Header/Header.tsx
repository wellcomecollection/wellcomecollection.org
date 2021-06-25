import { FunctionComponent, useState } from 'react';
import { font, classNames } from '../../../utils/classnames';
import WellcomeCollectionBlack from '../../../icons/wellcome_collection_black';
import styled from 'styled-components';

type WrapperProps = {
  isBurgerOpen: boolean;
  navHeight: number;
};
const Wrapper = styled.div.attrs({
  className: classNames({
    'grid bg-white border-color-pumice border-bottom-width-1': true,
  }),
})<WrapperProps>`
  ${props =>
    props.isBurgerOpen &&
    `
      @media(min-width: 0) and (max-width: ${props.theme
        .headerMediumBreakpoint - 1}px) {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 10;
      }
    `}
  height: ${props => props.navHeight}px;
`;

const Burger = styled.div`
  display: block;

  @media (min-width: ${props => props.theme.headerMediumBreakpoint}px) {
    display: none;
  }
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

  @media (min-width: ${props => props.theme.headerMediumBreakpoint}px) {
    margin-left: 0;
    flex: 0 0 auto;
    margin-right: 1.5rem;
    padding-right: 1.5rem;
    border-right: 1px solid ${props => props.theme.color('pumice')};
    width: auto;
    display: block;
  }

  a {
    margin: 0 auto;
  }
`;

const HeaderNav = styled.nav<{ isActive: boolean }>`
  display: ${props => (props.isActive ? 'block' : 'none')};
  background: ${props => props.theme.color('white')};
  position: absolute;
  z-index: 1;
  top: 100%;
  left: 0;
  right: 0;
  padding-left: ${props =>
    props.theme.grid.s.padding + props.theme.grid.s.gutter}px;
  padding-right: ${props => props.theme.grid.s.padding}px;

  @media (min-width: 0) and (max-width: ${props =>
      props.theme.headerMediumBreakpoint - 1}px) {
    border-top: 1px solid ${props => props.theme.color('pumice')};
    min-height: 100vh;
  }

  @media (min-width: ${props => props.theme.sizes.medium}px) {
    padding-left: ${props =>
      props.theme.grid.m.padding + props.theme.grid.m.gutter}px;
    padding-right: ${props => props.theme.grid.m.padding}px;
  }

  @media (min-width: ${props => props.theme.headerMediumBreakpoint}px) {
    position: static;
    display: block;
    margin-top: 0;
    padding-left: 0;
    padding-right: 0;
  }
`;

const HeaderList = styled.ul`
  margin-left: -0.3rem;

  @media (min-width: ${props => props.theme.headerMediumBreakpoint}px) {
    display: flex;
  }
`;

const HeaderItem = styled.li`
  border-bottom: 1px solid ${props => props.theme.color('pumice')};

  // TODO: the vw units below are tightly coupled to the
  // number of nav items and number of characters in them.
  // This is a stop-gap ahead of nav design rework.
  @media (min-width: ${props => props.theme.headerMediumBreakpoint}px) {
    border-bottom: 0;
    margin-right: 1vw;
  }

  @media (min-width: ${props => props.theme.sizes.large}px) {
    margin-right: 2vw;
  }

  @media (min-width: ${props =>
      props.theme.headerMediumBreakpoint}px) and (max-width: ${props =>
      props.theme.sizes.large - 1}px) {
    font-size: 1.6vw;
  }

  @media (min-width: ${props => props.theme.sizes.xlarge}px) {
    margin-right: 2rem;
  }
`;

const HeaderLink = styled.a<{ isActive: boolean }>`
  padding: 2rem 0.3rem;
  display: inline-block;
  text-decoration: none;
  position: relative;
  z-index: 1;
  transition: color 400ms ease;

  @media (min-width: ${props => props.theme.headerMediumBreakpoint}px) {
    padding-top: 1rem;
    padding-bottom: 1rem;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: 1.9rem;
    height: 0.6rem;
    left: 0;
    width: 0;
    background: ${props => props.theme.color('yellow')};
    z-index: -1;
    transition: width 200ms ease;

    @media (min-width: ${props => props.theme.headerMediumBreakpoint}px) {
      bottom: 0.9rem;
    }
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

  return (
    <Wrapper navHeight={navHeight} isBurgerOpen={isActive}>
      <div className="relative grid__cell" style={{ padding: '15px 0 15px' }}>
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
            <a href="/" className="header__brand-link">
              <WellcomeCollectionBlack />
            </a>
          </HeaderBrand>
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
            </HeaderList>
          </HeaderNav>
          {/* we leave this here until we know exactly what we want to do with search */}
          <div id="header-search" className="header__search" />
        </div>
      </div>
    </Wrapper>
  );
};

export default Header;
