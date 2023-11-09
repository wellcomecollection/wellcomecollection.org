import styled from 'styled-components';
import { classNames, font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';

export const Wrapper = styled.div`
  ${props =>
    `
      margin: 0 -${props.theme.containerPadding.small}px;
      transition: margin ${props => props.theme.transitionProperties};

    ${props.theme.media('medium')(`
        margin: 0 calc(-${props.theme.containerPadding.medium}px + 16px);
    `)}

    ${props.theme.media('large')(`
        margin: 0 calc(-${props.theme.containerPadding.large}px + 16px);
    `)}

    ${props.theme.media('xlarge')(`
        margin-right: 0;
    `)}
  `}
`;

// -1px is to make up for the extra pixel applied by the Divider
// The goal being to align it perfectly with search/images
export const DividerWrapper = styled.div`
  ${props =>
    `
      margin: 0 -${props.theme.containerPadding.small}px -1px;

    ${props.theme.media('medium')(`
        margin: 0 calc(-${props.theme.containerPadding.medium}px + 1rem) -1px ;
    `)}

    ${props.theme.media('large')(`
        margin: 0 calc(-${props.theme.containerPadding.large}px + 1rem) -1px ;
    `)}
  `}
`;

export const TabsContainer = styled.div`
  display: flex;
  list-style: none;
  padding: 0;
  overflow-x: auto;
  padding-left: ${props => props.theme.containerPadding.small}px;

  ${props => `
    ${props.theme.media('medium')(`
      padding-left: calc(${props.theme.containerPadding.medium}px - 16px);
  `)}

  ${props.theme.media('large')(`
    padding-left: calc(${props.theme.containerPadding.large}px - 16px);
  `)}
  `}
`;

type NavItemProps = {
  selected: boolean;
};

export const Tab = styled.div.attrs({
  className: font('intb', 5),
})<NavItemProps>`
  flex-shrink: 0;

  border-bottom: ${props =>
    props.selected
      ? `3px solid ${props.theme.color('yellow')}`
      : `1px solid ${props.theme.color('neutral.400')}`};
`;

type NavItemInnerProps = {
  selected: boolean;
};
export const NavItemInner = styled(Space).attrs<NavItemInnerProps>(props => {
  return {
    as: 'a',
    className: classNames({ selected: props.selected }),
    h: { size: 'l', properties: ['padding-left', 'padding-right'] },
    v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  };
})<NavItemInnerProps>`
  display: block;
  position: relative;
  cursor: pointer;
  color: ${props =>
    props.theme.color(props.selected ? 'black' : 'neutral.600')};
  text-decoration: none;
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
      background-color: ${props => props.theme.color('lightYellow')};

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
