import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import { classNames } from '@weco/common/utils/classnames';

export const TabsContainer = styled.div.attrs({
  className: 'no-margin',
})`
  display: flex;
  list-style: none;
  padding: 0;
`;

export const Tab = styled.button.attrs({
  className: 'plain-button no-margin font-intb',
})`
  padding: 0;
  margin-right: 1vw;
  flex: 1 1 50%;
  text-align: center;

  ${props => props.theme.media('medium')`
    flex: 0 1 auto;
    text-align: left;
  `}
`;

type NavItemInnerProps = {
  selected: boolean;
  isDarkMode?: boolean;
};
export const NavItemInner = styled(Space).attrs<NavItemInnerProps>(props => {
  return {
    as: 'span',
    className: classNames({ selected: props.selected }),
    h: { size: 'm', properties: ['margin-right'] },
    v: { size: 'm', properties: ['padding-top'] },
  };
})<NavItemInnerProps>`
  display: block;
  position: relative;
  z-index: 1;
  padding: 1em 0.3em;
  cursor: pointer;
  color: ${props =>
    props.theme.color(
      props.isDarkMode
        ? props.selected
          ? 'white'
          : 'warmNeutral.400'
        : props.selected
        ? 'black'
        : 'neutral.600'
    )};
  transition: all ${props => props.theme.transitionProperties};

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 3px;
    left: 0;
    width: 0;
    background-color: ${props =>
      props.theme.color(
        props.isDarkMode
          ? props.selected
            ? 'white'
            : 'warmNeutral.400'
          : props.selected
          ? 'black'
          : 'neutral.600'
      )};
    z-index: -1;
    transition: width 200ms ease;
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

  &.selected:after {
    width: 100%;
  }
`;
