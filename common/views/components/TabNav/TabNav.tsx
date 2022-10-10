import {
  FC,
  useRef,
  Dispatch,
  SetStateAction,
  ReactNode,
  KeyboardEvent,
} from 'react';
import { trackEvent } from '@weco/common/utils/ga';
import { Wrapper, TabsContainer, Tab, NavItemInner } from './TabNav.styles';

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
  isInContainer?: boolean;
  isDarkMode?: boolean;
};

const TabNav: FC<Props> = ({
  id,
  items,
  selectedTab,
  setSelectedTab,
  isInContainer = false,
  isDarkMode = false,
}: Props) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  // TODO stole this from BaseTabs. Get together once we get rid of SearchTabs?
  function focusTabAtIndex(index: number): void {
    const element = tabListRef?.current?.querySelector(
      `#tab-${items[index].id}`
    ) as HTMLDivElement;

    element?.focus();
  }

  const sendEvent = (id: string) => {
    trackEvent({
      category: 'TabNav',
      action: 'Tab clicked',
      label: id,
    });
  };

  // TODO stole this from BaseTabs. Get together?
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
      sendEvent(items[prevIndex].id);
    }

    if (RIGHT.includes(key)) {
      setSelectedTab(items[nextIndex].id);
      focusTabAtIndex(nextIndex);
      sendEvent(items[nextIndex].id);
    }

    if (HOME.includes(key)) {
      setSelectedTab(items[0].id);
      focusTabAtIndex(0);
      sendEvent(items[0].id);
    }

    if (END.includes(key)) {
      setSelectedTab(items[items.length - 1].id);
      focusTabAtIndex(items.length - 1);
      sendEvent(items[items.length - 1].id);
    }
  };

  return (
    <Wrapper isInContainer={isInContainer}>
      <TabsContainer
        role="tablist"
        ref={tabListRef}
        aria-label={`Tabs for ${id}`}
      >
        {items.map(item => (
          <Tab
            key={item.id}
            id={`tab-${item.id}`}
            role="tab"
            aria-controls={`tabpanel-${item.id}`}
            tabIndex={item.selected ? 0 : -1}
            aria-selected={item.selected}
            onClick={() => {
              if (!item.selected) {
                setSelectedTab(item.id);

                sendEvent(item.id);
              }
            }}
            onKeyDown={handleKeyDown}
          >
            <NavItemInner selected={item.selected} isDarkMode={isDarkMode}>
              {item.text}
            </NavItemInner>
          </Tab>
        ))}
      </TabsContainer>
    </Wrapper>
  );
};

export default TabNav;
