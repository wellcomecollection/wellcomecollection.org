// @flow

import styled from 'styled-components';
import NextLink from 'next/link';
import { type TextLink } from '../../../model/text-links';
import { font, classNames } from '../../../utils/classnames';
import Space from '../styled/Space';
import TogglesContext from '@weco/common/views/components/TogglesContext/TogglesContext';

type SelectableTextLink = {|
  ...TextLink,
  selected: boolean,
  onClick?: (SyntheticEvent<HTMLAnchorElement>) => void,
|};

type Props = {
  items: SelectableTextLink[],
};

const NavItemInner = styled(Space).attrs(props => ({
  className: classNames({
    selected: props.selected,
    block: true,
    relative: true,
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

const NavItemInnerTemp = styled.span.attrs(props => ({
  className: classNames({
    selected: props.selected,
    block: true,
    relative: true,
    'font-size-5 font-hnl': true,
  }),
}))`
  z-index: 1;
  padding: 0 0.3em;
  white-space: nowrap;

  &.selected {
    text-decoration: underline;
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
      <TogglesContext.Consumer>
        {({ showDatesAggregatePrototype }) => (
          <>
            {showDatesAggregatePrototype &&
            (text !== 'All' && text !== 'Pictures' && text !== 'Books') ? (
              <NavItemInnerTemp selected={selected}>{text}</NavItemInnerTemp>
            ) : (
              <NavItemInner
                as="span"
                h={{ size: 'm', properties: ['margin-right'] }}
                selected={selected}
              >
                {text}
              </NavItemInner>
            )}
          </>
        )}
      </TogglesContext.Consumer>
    </Space>
  </NextLink>
);

const TabNav = ({ items }: Props) => {
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
