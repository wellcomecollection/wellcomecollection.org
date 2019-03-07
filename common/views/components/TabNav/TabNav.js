// @flow

import styled from 'styled-components';
import NextLink from 'next/link';
import { type TextLink } from '../../../model/text-links';
import { spacing, font, classNames } from '../../../utils/classnames';

type SelectableTextLink = {| ...TextLink, selected: boolean |};

// TODO: This large property is a bit silly but okay for while we're testing
type Props = {
  items: SelectableTextLink[],
  large: boolean,
};

const NavItemInner = styled(({ className, selected, children, large }) => (
  <span
    className={classNames({
      selected,
      block: true,
      relative: true,
      [className]: true,
      [spacing({ s: 3 }, { margin: ['right'] })]: large,
    })}
  >
    {children}
  </span>
))`
  padding: ${props => (props.large ? '1rem 0.3rem' : '0 0.3rem 1rem')};
  z-index: 1;

  &:after {
    content: '';
    position: absolute;
    bottom: 1rem;
    height: 0.6rem;
    left: 0;
    width: 0;
    background: ${props => props.theme.colors.yellow};
    z-index: -1;
    transition: width 200ms ease;
  }

  &.selected,
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
`;

const NavItem = ({
  link,
  text,
  selected,
  large,
}: {|
  ...SelectableTextLink,
  large: boolean,
|}) => (
  <NextLink {...link}>
    <a
      className={classNames({
        'plain-link': true,
        block: true,
      })}
    >
      <NavItemInner selected={selected} large={large}>
        {text}
      </NavItemInner>
    </a>
  </NextLink>
);

const TabNav = ({ items, large }: Props) => {
  return (
    <div
      className={classNames({
        // Cancel out space below individual tags
        [font({ s: large ? 'HNM3' : 'HNM4' })]: true,
        [spacing({ s: -2 }, { margin: ['bottom'] })]: true,
      })}
    >
      <ul
        className={classNames({
          'plain-list': true,
          flex: true,
          [spacing({ s: 0 }, { padding: ['left'], margin: ['top'] })]: true,
        })}
      >
        {items.map(item => (
          <li
            key={item.text}
            style={{
              marginRight: '1vw',
            }}
          >
            <NavItem {...item} large={large} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabNav;
