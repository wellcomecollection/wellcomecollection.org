import {
  Fragment,
  FunctionComponent,
  MouseEvent,
  useState,
  useContext,
  useEffect,
} from 'react';
import styled from 'styled-components';
import { chevron, cross } from '@weco/common/icons';
import { classNames, font } from '@weco/common/utils/classnames';
import Icon from '@weco/common/views/components/Icon/Icon';
import { trackGaEvent } from '@weco/common/utils/ga';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { Period } from '@weco/common/types/periods';

type IsActiveProps = {
  isActive: boolean;
};

type DrawerItemProps = {
  isFirst: boolean;
};

const DrawerItem = styled(Space).attrs({
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom'],
  },
  as: 'li',
  className: font('wb', 4),
})<DrawerItemProps>`
  border-bottom: 1px solid ${props => props.theme.color('neutral.300')};

  a,
  a:link,
  a:visited {
    text-decoration: none;
    border: none;
  }

  ${props =>
    props.isFirst &&
    `
    border-top: 1px solid ${props.theme.color('neutral.300')};
  `}
`;

const List = styled(PlainList)<{ isEnhanced: boolean }>`
  border: 1px solid ${props => props.theme.color('black')};
  overflow: hidden;
  display: ${props => (props.isEnhanced ? 'none' : 'flex')};

  ${props =>
    props.isEnhanced &&
    props.theme.media('medium')`
      display: flex;
  `}
`;

type ItemProps = {
  isLast: boolean;
};

const Item = styled.li.attrs({
  className: font('wb', 6),
})<ItemProps>`
  display: flex;
  line-height: 1;
  flex: 1;
  border-right: 1px solid ${props => props.theme.color('black')};

  ${props =>
    props.isLast &&
    `
    border-right: 0;
  `}
`;

const ItemInner = styled.a.attrs<IsActiveProps>(props => ({
  className: classNames({
    'is-active': props.isActive,
  }),
}))<IsActiveProps>`
  display: block;
  width: 100%;
  text-align: center;
  transition: background ${props => props.theme.transitionProperties};

  text-decoration: none;
  border: none;

  &:link,
  &:visited {
    text-decoration: none;
    border: none;
  }

  color: ${props => props.theme.color(props.isActive ? 'white' : 'black')};
  background-color: ${props =>
    props.theme.color(props.isActive ? 'black' : 'white')};

  ${props =>
    props.theme.makeSpacePropertyValues('m', ['padding-top', 'padding-bottom'])}
  ${props =>
    props.theme.makeSpacePropertyValues('m', ['padding-left', 'padding-right'])}

  &:hover,
  &:focus {
    background: ${props =>
      props.theme.color(props.isActive ? 'neutral.600' : 'warmNeutral.400')};
  }
`;

const Drawer = styled.div`
  ${props => props.theme.media('medium')`
    display: none;
  `}
`;

const MobileControlsContainer = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: font('wb', 4),
})`
  display: flex;
  color: ${props => props.theme.color('white')};
  background-color: ${props => props.theme.color('black')};
`;

const MobileControlsModal = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})<{ isActive: boolean }>`
  background-color: ${props => props.theme.color('white')};
  display: ${props => (props.isActive ? 'block' : 'none')};
  position: fixed;
  z-index: 6; /*  Ensures that it's above the fixed header on mobile */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Button = styled.button<{ isActive: boolean }>`
  padding: 0;
  width: 100%;

  ${props =>
    props.isActive &&
    `
      width: auto;
      position: fixed;
      top: 4px;
      right: 10px;
      z-index: 7;
    `}
`;

const months = [
  'january',
  'feburary',
  'march',
  'april',
  'may',
  'june',
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
] as const;
type Month = (typeof months)[number];

export type DateID = `${Month}-${number}`;

const isOfTypeMonth = (input): input is Month => {
  return months.includes(input);
};

export const isOfTypeDateId = (input: unknown): input is DateID => {
  if (input instanceof String) {
    const sections = input.split('-');
    if (sections.length !== 2) return false;
    if (isOfTypeMonth(sections[0])) {
      if (Number(sections[1])) {
        return true;
      }
    }
    return false;
  } else {
    return false;
  }
};

export type ItemID = DateID | Period;
export type Item = { id: ItemID; text: string; url: string };

type Props = {
  id: string;
  items: Item[];
  activeId?: ItemID;
  onActiveIdChange?: (id: ItemID) => void;
  extraClasses?: string;
  ariaCurrentText?: string;
  // Note: parents don't always pass in a value for `setActiveId`.
  //
  // The best way to understand why is to look at an example: on the
  // What's On page, we use a segmented control for "Everything/Today/This weekend".
  // When you click on one of the segments, you get taken to a completely
  // different URL, e.g. from `/whats-on` to `/whats-on/today`.
  //
  // In this case, the state is tracked by the URL, and there's no need for
  // a setActiveId hook -- it will be updated by the re-render for the new URL.
  setActiveId?: (id: ItemID) => void;
};

const SegmentedControl: FunctionComponent<Props> = ({
  id,
  items,
  activeId,
  setActiveId,
  ariaCurrentText,
}) => {
  const { isEnhanced } = useContext(AppContext);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    setActiveId?.((window.location.hash.slice(1) as ItemID) || activeId);
  }, []);

  function onClick(
    e: MouseEvent<HTMLAnchorElement>,
    item: Item
  ): boolean | undefined {
    const url = e.currentTarget.href;
    const isHash = url.startsWith('#');

    trackGaEvent({
      category: 'SegmentedControl',
      action: 'select segment',
      label: item.text,
    });

    setActiveId && setActiveId(item.id);
    isEnhanced && setIsActive(false);

    // TODO: Do we still need this?  The original comment ("Assume we want to")
    // didn't provide much context, and it's not clear if/how this changes the
    // behaviour of the page, or indeed if it ever fires.
    //
    // The only page where we use SegmentedControl with anchors in the URL is
    // the What's On page, and testing locally the `isHash` value will never
    // be true – the `href` of the item is the full URL.
    if (isHash) {
      e.preventDefault();
      return false;
    }
  }

  return (
    <div>
      {isEnhanced && (
        <Drawer>
          <Button isActive={isActive}>
            {items
              .filter(item => item.id === activeId)
              .map(item => (
                <Fragment key={item.id}>
                  {!isActive ? (
                    <MobileControlsContainer onClick={() => setIsActive(true)}>
                      <span>{item.text}</span>
                      <Icon icon={chevron} iconColor="white" />
                    </MobileControlsContainer>
                  ) : (
                    <span onClick={() => setIsActive(false)}>
                      <span className="visually-hidden">close</span>
                      <Icon icon={cross} title="Close" />
                    </span>
                  )}
                </Fragment>
              ))}
          </Button>
          <MobileControlsModal isActive={isActive} id={id}>
            <Space v={{ size: 'm', properties: ['margin-bottom'] }}>See:</Space>
            <PlainList>
              {items.map((item, i) => (
                <DrawerItem isFirst={i === 0} key={item.id}>
                  <a onClick={e => onClick(e, item)} href={item.url}>
                    {item.text}
                  </a>
                </DrawerItem>
              ))}
            </PlainList>
          </MobileControlsModal>
        </Drawer>
      )}
      <List isEnhanced={isEnhanced}>
        {items.map((item, i) => (
          <Item key={item.id} isLast={i === items.length - 1}>
            <ItemInner
              isActive={isEnhanced && item.id === activeId}
              onClick={e => onClick(e, item)}
              href={item.url}
              aria-current={
                item.id === activeId
                  ? isNotUndefined(ariaCurrentText)
                  : undefined
              }
            >
              {item.text}
            </ItemInner>
          </Item>
        ))}
      </List>
    </div>
  );
};
export default SegmentedControl;
