import { ComponentType, FC } from 'react';
import styled from 'styled-components';
import NextLink from 'next/link';
import { TextLink } from '../../../model/text-links';
import { font, classNames } from '../../../utils/classnames';
import Space, { SpaceComponentProps } from '../styled/Space';

type SelectableTextLink = TextLink & {
  selected: boolean;
  onClick?: (event: SyntheticEvent<HTMLAnchorElement>) => void;
};

type Props = {
  items: SelectableTextLink[];
};

const NavItemInner: ComponentType<SpaceComponentProps> = styled(Space).attrs(
  props => ({
    className: classNames({
      selected: props.selected,
      block: true,
      relative: true,
    }),
  })
)`
  z-index: 1;
  padding: 0 0.3em;

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 0.6rem;
    left: 0;
    width: 0;
    background: ${props => props.theme.color('yellow')};
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

const NavItem = ({ link, text, selected, onClick }: SelectableTextLink) => (
  <NextLink {...link} passHref>
    <Space
      v={{
        size: 'm',
        properties: ['padding-top', 'padding-bottom'],
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
  </NextLink>
);

const TabNav: FC = ({ items }: Props) => {
  return (
    <div
      className={classNames({
        [font('intb', 4)]: true,
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
