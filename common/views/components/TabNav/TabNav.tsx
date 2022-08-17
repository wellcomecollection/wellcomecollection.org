import { FC } from 'react';
import styled from 'styled-components';
// import { NextLinkType } from '@weco/common/model/next-link-type';
import Space from '../styled/Space';
import { font, classNames } from '../../../utils/classnames';

type SelectableTextLink = {
  id: string;
  text: string;
  // TODO we probably want anchors here so people can share the url/go back to the correct section?
  // link: NextLinkType;
  selected: boolean;
  color?: string;
  onClick: (id: string) => void;
};

type Props = {
  items: SelectableTextLink[];
  color?: string;
};

type NavItemInnerProps = {
  selected: boolean;
};

// TODO do we want to make the border colour dynamic or not?
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
  border-bottom: 0 solid ${({ color, theme }) =>
    theme.color(color, 'dark') || theme.color('black')};
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

const NavItem = ({
  id,
  text,
  selected,
  color,
  onClick,
}: SelectableTextLink) => (
  <NavItemInner
    as="span"
    h={{ size: 'm', properties: ['margin-right'] }}
    v={{ size: 'm', properties: ['padding-top'] }}
    selected={selected}
    color={color}
    onClick={() => onClick(id)}
    role="tab"
    tabIndex={selected ? 0 : -1}
    aria-selected={selected}
  >
    {text}
  </NavItemInner>
);

const TabNav: FC<Props> = ({ items, color }: Props) => {
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
        role="tablist"
      >
        {items.map(item => (
          <li
            key={item.text}
            style={{
              marginRight: '1vw',
            }}
          >
            <NavItem {...item} color={color} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabNav;
