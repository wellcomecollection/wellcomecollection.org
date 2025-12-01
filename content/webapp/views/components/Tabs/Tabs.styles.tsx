import styled from 'styled-components';

import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import { focusStyle } from '@weco/common/views/themes/base/wellcome-normalize';

export const Wrapper = styled.div`
  ${props =>
    `
      margin: 0 -${props.theme.formatContainerPadding(props.theme.containerPadding.small)};
      transition: margin ${props => props.theme.transitionProperties};

    ${props.theme.media('medium')(`
        margin: 0 calc(-${props.theme.formatContainerPadding(props.theme.containerPadding.medium)} + 1rem);
    `)}

    ${props.theme.media('large')(`
        margin: 0 calc(-${props.theme.formatContainerPadding(props.theme.containerPadding.large)} + 1rem);
    `)}

    ${props.theme.media('xlarge')(`
        margin-right: 0;
    `)}
  `}
`;

export const TabsContainer = styled.div`
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  overflow-x: auto;

  /* Add vertical padding to prevent focus outline clipping */
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  margin-top: -0.5rem;
  margin-bottom: -0.5rem;

  padding-left: ${props =>
    props.theme.formatContainerPadding(props.theme.containerPadding.small)};

  ${props => `
    ${props.theme.media('medium')(`
      padding-left: calc(${props.theme.formatContainerPadding(props.theme.containerPadding.medium)} - 1rem);
  `)}

  ${props.theme.media('large')(`
    padding-left: calc(${props.theme.formatContainerPadding(props.theme.containerPadding.large)} - 1rem);
  `)}
  `}
`;

type NavItemProps = {
  $selected: boolean;
  $isWhite?: boolean;
  $hideBorder?: boolean;
  $designSystemFonts?: boolean;
};

export const Tab = styled.div.attrs<NavItemProps>(props => ({
  className: props.$designSystemFonts
    ? font(props.$selected ? 'intsb' : 'intr', 5)
    : font(props.$selected ? 'intsb' : 'intm', 5),
}))<NavItemProps>`
  padding: 0;
  margin: 0;
  flex-shrink: 0;
  border-bottom: ${props =>
    props.$selected
      ? `3px solid ${props.theme.color('yellow')}`
      : `1px solid ${props.theme.color(
          props.$hideBorder
            ? 'transparent'
            : props.$isWhite
              ? 'neutral.600'
              : 'neutral.300'
        )}`};

  a {
    text-decoration: none;

    /* For Tab.Anchor */
    &:focus-visible {
      display: block;
      ${focusStyle};
    }
  }
`;

export const TabButton = styled.div`
  /* For Tab.Tab */
  &:focus-visible {
    ${focusStyle};
  }
`;

export const NavItemInner = styled(Space).attrs<{ $selected: boolean }>(
  props => {
    return {
      as: 'span',
      className: classNames({ selected: props.$selected }),
      $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
      $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
    };
  }
)<{ $isWhite?: boolean }>`
  display: block;
  position: relative;
  z-index: 1;
  cursor: pointer;
  color: ${props => props.theme.color(props.$isWhite ? 'white' : 'black')};
  transition: all ${props => props.theme.transitionProperties};

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    height: 3px;
    left: 0;
    width: 0;
    transition: width 200ms ease;
  }

  &:hover,
  &:focus {
    &::after {
      width: 100%;
      background-color: ${props =>
        props.theme.color(props.$selected ? 'yellow' : 'lightYellow')};

      /* Prevent iOS double-tap link issue
       https://css-tricks.com/annoying-mobile-double-tap-link-issue/ */
      @media (pointer: coarse) {
        width: 0;
      }
    }
  }

  &.selected::after {
    width: 100%;
    background-color: transparent;

    a:focus-within & {
      background-color: ${props => props.theme.color('yellow')};
    }
  }
`;

// Prevent tabs layout shift that would result from diffent font weights
// by adding an element with the bold (widest) text content
export const NavItemShim = styled.div`
  font-weight: 700;
  height: 0;
  visibility: hidden;
`;

export const IconWrapper = styled.span`
  span {
    top: 6px;
  }
`;
