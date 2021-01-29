// Converted from flow to TSX element
import React, { ComponentType } from 'react';
import styled from 'styled-components';
import { font, classNames } from '@weco/common/utils/classnames';
import Space, { SpaceComponentProps } from '@weco/common/views/components/styled/Space';
import { Link } from 'react-router-dom';

// adapted from @weco/common/views/components/styled/Space
// to work with React Router's Link instead of Nextjs' Link component

export type SelectableTextLink = {
  text: string;
  link: any;
  selected: boolean;
  onClick?: (element: HTMLAnchorElement) => void;
};

type Props = {
  items: SelectableTextLink[];
};

const NavItemInner: ComponentType<SpaceComponentProps> = styled(Space).attrs((props: any) => ({
  className: classNames({
    selected: props.selected,
    block: true,
    relative: true,
  }),
}))`
  z-index: 1;
  padding: 0 0.3em;
  text-decoration: none !important;
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 0.6rem;
    left: 0;
    width: 0;
    background: ${(props) => props.theme.color('yellow')};
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

const TabLink = styled(Link)`
  text-decoration: none;
`;

const NavItem = ({ link, text, selected, onClick }: SelectableTextLink) => (
  <TabLink {...link}>
    <Space
      v={{
        size: 'm',
        properties: ['padding-top', 'padding-bottom'],
      }}
      className={classNames({
        'plain-link': true,
        block: true,
      })}
      onClick={onClick}
    >
      <NavItemInner h={{ size: 'm', properties: ['margin-right'] }} selected={selected}>
        {text}
      </NavItemInner>
    </Space>
  </TabLink>
);

const TabNav = ({ items }: Props): JSX.Element => {
  return (
    <div
      className={classNames({
        [font('hnm', 4)]: true,
      })}
    >
      <ul
        className={classNames({
          'plain-list no-margin no-padding': true,
          'flex flex--wrap': true,
        })}
      >
        {items.map((item) => (
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
