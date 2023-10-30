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

export const Tab = styled.button.attrs({
  className: font('intb', 5),
})`
  margin: 0;
  padding: 0 1.5rem 0 0;
  flex-shrink: 0;
  transition: padding ${props => props.theme.transitionProperties};

  &:first-child span {
    padding-left: 0;
  }

  ${props =>
    props.theme.media('medium')(`
      padding-right: 2rem;
  `)}
  ${props =>
    props.theme.media('large')(`
      padding-right: 3rem;
  `)}
`;

type NavItemInnerProps = {
  $selected: boolean;
  $variant?: 'yellow' | 'white';
};
export const NavItemInner = styled(Space).attrs<NavItemInnerProps>(props => ({
  as: 'span',
  className: classNames({ selected: props.$selected }),
}))<NavItemInnerProps>`
  display: block;
  position: relative;
  z-index: 1;
  padding: 1.5rem 0.25rem;
  cursor: pointer;
  color: ${props =>
    props.theme.color(
      props.$variant === 'white'
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
    bottom: 0;
    height: 3px;
    left: 0;
    width: 0;
    background-color: ${props =>
      props.theme.color(
        props.$selected
          ? props.$variant === 'white'
            ? 'white'
            : props.$variant === 'yellow'
            ? 'yellow'
            : 'black'
          : props.$variant === 'white'
          ? 'warmNeutral.400'
          : props.$variant === 'yellow'
          ? 'lightYellow'
          : 'neutral.600'
      )};
    z-index: -1;
    transition: width 200ms ease;
  }

  &:hover,
  &:focus {
    &::after {
      width: 100%;

      /* Prevent iOS double-tap link issue
       https://css-tricks.com/annoying-mobile-double-tap-link-issue/ */
      @media (pointer: coarse) {
        width: 0;
      }
    }
  }

  &.selected::after {
    width: 100%;
  }
`;
