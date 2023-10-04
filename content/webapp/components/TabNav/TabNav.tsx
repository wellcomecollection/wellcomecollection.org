import {
  FunctionComponent,
  useRef,
  Dispatch,
  SetStateAction,
  ReactNode,
  KeyboardEvent,
} from 'react';
import { trackGaEvent } from '@weco/common/utils/ga';
import { Wrapper, TabsContainer, Tab, NavItemInner } from './TabNav.styles';
import Divider from '@weco/common/views/components/Divider/Divider';
import { trackSegmentEvent } from '@weco/common/services/conversion/track';

type SendEventProps = {
  id: string;
  trackWithSegment: boolean;
};

function sendEvent({ id, trackWithSegment }: SendEventProps) {
  trackGaEvent({
    category: 'TabNav',
    action: 'Tab clicked',
    label: id,
  });
  if (trackWithSegment) {
    trackSegmentEvent({
      name: 'Click tab nav',
      eventGroup: 'conversion',
      properties: {
        tabId: id,
      },
    });
  }
}

type SelectableTextLink = {
  id: string;
  text: ReactNode;
  selected: boolean;
};

type Props = {
  id: string;
  items: SelectableTextLink[];
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  variant?: 'yellow' | 'white';
  hasDivider?: boolean;
  trackWithSegment?: boolean;
};

const TabNav: FunctionComponent<Props> = ({
  id,
  items,
  selectedTab,
  setSelectedTab,
  variant,
  hasDivider,
  trackWithSegment = false,
}: Props) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  function focusTabAtIndex(index: number): void {
    const element = tabListRef?.current?.querySelector(
      `#tab-${items[index].id}`
    ) as HTMLDivElement;

    element?.focus();
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    const LEFT = [37, 'ArrowLeft'];
    const RIGHT = [39, 'ArrowRight'];
    const HOME = [36, 'Home'];
    const END = [35, 'End'];
    const key = event.key || event.keyCode;
    const isKeyOfInterest = [...LEFT, ...RIGHT, ...HOME, ...END].includes(key);

    if (!isKeyOfInterest) return;

    event.preventDefault();
    const currentTab = items.find(t => t.id === selectedTab) || items[0];
    const currentIndex = items.indexOf(currentTab);
    const nextIndex = items[currentIndex + 1] ? currentIndex + 1 : 0;
    const prevIndex = items[currentIndex - 1]
      ? currentIndex - 1
      : items.length - 1;

    if (LEFT.includes(key)) {
      setSelectedTab(items[prevIndex].id);
      focusTabAtIndex(prevIndex);
      sendEvent({ id: items[prevIndex].id, trackWithSegment });
    }

    if (RIGHT.includes(key)) {
      setSelectedTab(items[nextIndex].id);
      focusTabAtIndex(nextIndex);
      sendEvent({ id: items[nextIndex].id, trackWithSegment });
    }

    if (HOME.includes(key)) {
      setSelectedTab(items[0].id);
      focusTabAtIndex(0);
      sendEvent({ id: items[0].id, trackWithSegment });
    }

    if (END.includes(key)) {
      setSelectedTab(items[items.length - 1].id);
      focusTabAtIndex(items.length - 1);
      sendEvent({ id: items[items.length - 1].id, trackWithSegment });
    }
  };

  return (
    <Wrapper>
      <TabsContainer role="tablist" ref={tabListRef} aria-label={id}>
        {items.map(item => (
          <Tab
            key={item.id}
            id={`tab-${item.id}`}
            role="tab"
            aria-controls={`tabpanel-${item.id}`}
            tabIndex={item.selected ? 0 : -1}
            aria-selected={item.selected}
            onClick={e => {
              if (!item.selected) {
                (e.target as HTMLButtonElement).scrollIntoView({
                  behavior: 'smooth',
                  inline: 'start',
                  block: 'nearest',
                });

                setSelectedTab(item.id);

                sendEvent({ id: item.id, trackWithSegment });
              }
            }}
            onKeyDown={handleKeyDown}
          >
            <NavItemInner selected={item.selected} variant={variant}>
              {item.text}
            </NavItemInner>
          </Tab>
        ))}
      </TabsContainer>

      {hasDivider && <Divider lineColor="neutral.300" />}
    </Wrapper>
  );
};

export default TabNav;