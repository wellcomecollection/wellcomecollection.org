// @flow

import styled from 'styled-components';
import NextLink from 'next/link';
import { type TextLink } from '../../../model/text-links';
import { spacing, font, classNames } from '../../../utils/classnames';
import VerticalSpace from '../styled/VerticalSpace';

type SelectableTextLink = {|
  ...TextLink,
  selected: boolean,
  onClick?: (SyntheticEvent<HTMLAnchorElement>) => void,
|};

type Props = {
  items: SelectableTextLink[],
};

const NavItemInner = styled.span.attrs(props => ({
  className: classNames({
    selected: props.selected,
    block: true,
    relative: true,
    [spacing({ s: 3 }, { margin: ['right'] })]: true,
  }),
}))`
  z-index: 1;
  padding: 0 0.3em;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 0.6rem;
    left: 0;
    width: 0;
    background: ${props => props.theme.colors.yellow};
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

const NavItem = ({
  link,
  text,
  selected,
  onClick,
}: {|
  ...SelectableTextLink,
|}) => (
  <NextLink {...link}>
    <VerticalSpace
      as="a"
      size="m"
      properties={['padding-top', 'padding-bottom']}
      className={classNames({
        'plain-link': true,
        block: true,
      })}
      onClick={onClick}
    >
      <NavItemInner selected={selected}>{text}</NavItemInner>
    </VerticalSpace>
  </NextLink>
);

const TabNav = ({ items }: Props) => {
  return (
    <div
      className={classNames({
        [font({ s: 'HNM3' })]: true,
      })}
    >
      <ul
        className={classNames({
          'plain-list no-margin no-padding': true,
          flex: true,
        })}
      >
        {items.map(item => (
          <li
            key={item.text}
            style={{
              marginRight: '1vw',
            }}
          >
            <NavItem {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabNav;
