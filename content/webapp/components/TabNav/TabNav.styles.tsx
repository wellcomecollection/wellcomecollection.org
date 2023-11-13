import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { classNames, font } from '@weco/common/utils/classnames';

export const Wrapper = styled.div`
  ${props =>
    `
      margin: 0 -${props.theme.containerPadding.small}px;
      transition: margin ${props => props.theme.transitionProperties};

    ${props.theme.media('medium')(`
        margin: 0 calc(-${props.theme.containerPadding.medium}px + 1rem);
    `)}

    ${props.theme.media('large')(`
        margin: 0 calc(-${props.theme.containerPadding.large}px + 1rem);
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
  padding-left: ${props => props.theme.containerPadding.small}px;

  ${props => `
    ${props.theme.media('medium')(`
      padding-left: calc(${props.theme.containerPadding.medium}px - 1rem);
  `)}

  ${props.theme.media('large')(`
    padding-left: calc(${props.theme.containerPadding.large}px - 1rem);
  `)}
  `}
`;

type NavItemProps = {
  $selected: boolean;
  $isWhite: boolean;
};

export const Tab = styled.div.attrs({
  className: font('intb', 5),
})<NavItemProps>`
  padding: 0;
  margin: 0;
  flex-shrink: 0;
  border-bottom: ${props =>
    props.$selected
      ? `3px solid ${props.theme.color('yellow')}`
      : `1px solid ${props.theme.color(
          props.$isWhite ? 'neutral.600' : 'neutral.400'
        )}`};

  a {
    text-decoration: none;
  }
`;

export const TabButton = styled.div.attrs({
  className: font('intb', 5),
})<NavItemProps>``;

type NavItemInnerProps = {
  $selected: boolean;
  $isWhite?: boolean;
};
export const NavItemInner = styled(Space).attrs<NavItemInnerProps>(props => {
  return {
    as: 'span',
    className: classNames({ selected: props.$selected }),
    $h: { size: 'l', properties: ['padding-left', 'padding-right'] },
    $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  };
})<NavItemInnerProps>`
  display: block;
  position: relative;
  z-index: 1;
  cursor: pointer;
  color: ${props =>
    props.theme.color(
      props.$isWhite
        ? props.$selected
          ? 'white'
          : 'warmNeutral.400'
        : props.$selected
        ? 'black'
        : 'neutral.600'
    )};
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
  }
`;
