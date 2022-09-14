import { FC, Dispatch, SetStateAction } from 'react';
import styled from 'styled-components';
import Space from '../styled/Space';
import { font, classNames } from '../../../utils/classnames';

type SelectableTextLink = {
  id: string;
  text: string;
  // TODO we probably want anchors here so people can share the url/go back to the correct section?
  // link: NextLinkType;
  selected: boolean;
};

type Props = {
  items: SelectableTextLink[];
  setSelectedTab: Dispatch<SetStateAction<string>>;
  color?: string;
  isDarkMode?: boolean;
};

type NavItemInnerProps = {
  selected: boolean;
  isDarkMode?: boolean;
};

const NavItemInner = styled(Space).attrs<NavItemInnerProps>(props => {
  return {
    className: classNames({
      selected: props.selected,
    }),
  };
})<NavItemInnerProps>`
  display: block;
  position: relative;
  z-index: 1;
  padding: 1em 0.3em;
  cursor: pointer;
  color: ${props => props.theme.color(props.isDarkMode ? 'white' : 'black')};
  opacity: ${props => (props.selected ? '1' : '0.6')};
  transition: all ${props => props.theme.transitionProperties};

  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    height: 3px;
    left: 0;
    width: 0;
    background-color: ${props => {
      return props.theme.color(
        props.color ? props.color : props.isDarkMode ? 'white' : 'black'
      );
    }};
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

const TabNavV2: FC<Props> = ({
  items,
  setSelectedTab,
  color,
  isDarkMode = false,
}: Props) => {
  return (
    <div className={font('intb', 5)}>
      <ul
        className="plain-list no-margin no-padding flex flex--wrap"
        role="tablist"
      >
        {items.map(item => (
          <li
            key={item.text}
            style={{
              marginRight: '1vw',
            }}
            onClick={() => {
              if (!item.selected) setSelectedTab(item.id);
            }}
            role="tab"
            tabIndex={item.selected ? 0 : -1}
            aria-selected={item.selected}
          >
            <NavItemInner
              as="span"
              h={{ size: 'm', properties: ['margin-right'] }}
              v={{ size: 'm', properties: ['padding-top'] }}
              selected={item.selected}
              color={color}
              isDarkMode={isDarkMode}
            >
              {item.text}
            </NavItemInner>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TabNavV2;
