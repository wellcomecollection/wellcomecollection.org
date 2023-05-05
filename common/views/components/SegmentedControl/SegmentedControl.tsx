import {
  Fragment,
  FunctionComponent,
  HTMLAnchorElement,
  MouseEvent,
  useState,
  useContext,
} from 'react';
import { chevron, cross } from '@weco/common/icons';
import { classNames, font } from '../../../utils/classnames';
import Icon from '../Icon/Icon';
import { trackGaEvent } from '../../../utils/ga';
import PlainList from '../styled/PlainList';
import Space from '../styled/Space';
import styled from 'styled-components';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';

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

  ${props =>
    props.isFirst &&
    `
    border-top: 1px solid ${props.theme.color('neutral.300')};
  `}
`;

const List = styled(PlainList).attrs({
  className: 'rounded-diagonal',
})<{ isEnhanced: boolean }>`
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
    'plain-link no-visible-focus': true,
  }),
}))<IsActiveProps>`
  display: block;
  width: 100%;
  text-align: center;
  transition: background ${props => props.theme.transitionProperties};

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
  className: font('wb', 4) + ' ' + 'rounded-diagonal',
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
  z-index: 6; // Ensures that it's above the fixed header on mobile
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
`;

const Button = styled.button.attrs({
  className: 'plain-button',
})<{ isActive: boolean }>`
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

const PlainLink = styled.a.attrs({
  className: 'plain-link',
})`
  display: block;
`;

type SegmentedControlItem = { id: string; text: string; url: string };

type Props = {
  id: string;
  items: SegmentedControlItem[];
  ariaCurrentText?: string;
  // Note: parents don't always pass in a value for `setActiveId`.
  //
  // The best way to understand why is to look at an example: on the
  // What's On page, we use a segmented control for "Everything/Today/This weekend".
  // When you click on one of the segments, you get taken to a completely
  // different URL, e.g. from `/whats-on` to `/whats-on/today`.
  //
  // When you go to that new URL, it'll completely re-render the page,
  // including this component, getting the new value of `activeId` from the URL.
  // It doesn't make sense for the What's On page to pass in a `setActiveId`
  // function -- even if called, the outcome would never be used, because
  // the user is about to be taken to a new URL/page.
  activeId: string;
  setActiveId?: (id: string) => void;
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

  function onClick(
    e: MouseEvent<HTMLAnchorElement>,
    item: SegmentedControlItem
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
                  <PlainLink onClick={e => onClick(e, item)} href={item.url}>
                    {item.text}
                  </PlainLink>
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
              isActive={item.id === activeId}
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
