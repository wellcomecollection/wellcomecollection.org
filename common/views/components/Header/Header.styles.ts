import styled from 'styled-components';

import { BorderlessButton } from '@weco/common/views/components/BorderlessClickable';
import { Container } from '@weco/common/views/components/styled/Container';

export const NavLoginWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${props => props.theme.media('headerMedium')`
  width: 100%;
`}
`;

type WrapperProps = {
  $isBurgerOpen: boolean;
};
export const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  justify-content: center;
  position: relative;
  z-index: 6;
  background-color: ${props => props.theme.color('white')};
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};
  height: ${props => props.theme.navHeight}px;

  ${props =>
    props.$isBurgerOpen &&
    `${props.theme.mediaBetween(
      'zero',
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
export const Burger = styled.div`
  display: block;

  ${props => props.theme.media('headerMedium')`
  display: none;
`}
`;
export const BurgerTrigger = styled.a<{ $burgerMenuisActive: boolean }>`
  position: relative;
  width: 1.2rem;
  height: 0.9rem;
  display: block;

  /* TODO: replace with svg-sprite icon */
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
      props.$burgerMenuisActive &&
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

export const HeaderBrand = styled.div<{ $isMinimalHeader: boolean }>`
  display: flex;
  flex: 1;

  ${props =>
    props.$isMinimalHeader
      ? `
        // This is to account for the burger as we want it to be dead centre.
        margin-left: -20px;
        ${props.theme.media('headerMedium')(`
          margin-left: 0;`)};
      `
      : ``}

  ${props => `
  ${props.theme.media('headerMedium')(`
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
export const HeaderNav = styled.nav<{ $burgerMenuisActive: boolean }>`
  display: ${props => (props.$burgerMenuisActive ? 'block' : 'none')};
  background: ${props => props.theme.color('white')};
  position: absolute;
  top: calc(100% + 17px); /* Accounts for the set size of the header */
  left: 0;
  right: 0;
  padding-left: ${props => props.theme.containerPadding};
  padding-right: ${props => props.theme.containerPadding};

  ${props => `
  ${props.theme.mediaBetween(
    'zero',
    'headerMedium'
  )(`
    border-top: 1px solid ${props.theme.color('warmNeutral.400')};
    height: calc(100vh - 17px); // Accounts for the set size of the header
    overflow: auto;
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

export const HeaderList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;

  ${props => props.theme.media('headerMedium')`
  display: flex;
`}
`;

export const HeaderItem = styled.li`
  border-bottom: 1px solid ${props => props.theme.color('warmNeutral.400')};

  /* TODO: the vw units below are tightly coupled to the
   number of nav items and number of characters in them.
   This is a stop-gap ahead of nav design rework. */

  ${props => `
  ${props.theme.media('headerMedium')`
    border-bottom: 0;
    margin-right: calc(3vw - 20px);
  `}

  ${props.theme.mediaBetween(
    'headerMedium',
    'md'
  )(`
    font-size: 1.5vw;
  `)}

  ${props.theme.media('lg')`
    margin-right: 1.4rem;
  `}
`}
`;

type HeaderLinkProps = {
  $burgerMenuisActive: boolean;
  'data-gtm-trigger'?: 'header_nav_link';
};
export const HeaderLink = styled.a.attrs<HeaderLinkProps>({
  'data-gtm-trigger': 'header_nav_link',
})`
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

  &::after {
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

  &:hover {
    &::after {
      width: 100%;

      /* Prevent iOS double-tap link issue
      https://css-tricks.com/annoying-mobile-double-tap-link-issue/ */
      @media (pointer: coarse) {
        width: 0;
      }
    }
  }

  ${props =>
    props.$burgerMenuisActive &&
    `
      &::after {
        width: 100%;
      }
    `}
`;

export const HeaderActions = styled.div`
  display: flex;
`;

export const SearchButton = styled(BorderlessButton)`
  margin-right: 0;

  ${props =>
    props.theme.media('headerMedium')(`
      margin-right:10px;
  `)}
`;

export const HeaderContainer = styled(Container)`
  display: flex;
  align-items: center;
`;
