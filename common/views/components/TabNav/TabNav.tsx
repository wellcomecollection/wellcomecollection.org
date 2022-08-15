import { SyntheticEvent, FunctionComponent } from 'react';
import styled from 'styled-components';
import { NextLinkType } from '@weco/common/model/next-link-type';
import Space from '../styled/Space';
import { font, classNames } from '../../../utils/classnames';

type SelectableTextLink = {
  text: string;
  link: NextLinkType;
  selected: boolean;
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

type Props = {
  items: SelectableTextLink[];
};

type NavItemInnerProps = {
  selected: boolean;
};

const NavItemInner = styled(Space).attrs<NavItemInnerProps>(props => {
  return {
    className: classNames({
      selected: props.selected,
      block: true,
      relative: true,
    }),
  };
})<NavItemInnerProps>`
  z-index: 1;
  padding: 0 0.3em 1.5em;
  border-bottom: 0 solid ${props => props.theme.color('black')};
  transition: width 200ms ease;
  cursor: pointer;

  &.selected {
    border-bottom-width: 3px;

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

const NavItem = ({ text, selected, onClick }: SelectableTextLink) => (
  <Space
    v={{
      size: 'm',
      properties: ['padding-top'],
    }}
    as="a"
    className={classNames({
      'plain-link': true,
      block: true,
    })}
    onClick={onClick}
  >
    <NavItemInner
      as="span"
      h={{ size: 'm', properties: ['margin-right'] }}
      selected={selected}
    >
      {text}
    </NavItemInner>
  </Space>
);

const TabNav: FunctionComponent<Props> = ({ items }: Props) => {
  return (
    <div
      className={classNames({
        [font('hnb', 4)]: true,
      })}
    >
      <ul
        className={classNames({
          'plain-list no-margin no-padding': true,
          'flex flex--wrap': true,
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
