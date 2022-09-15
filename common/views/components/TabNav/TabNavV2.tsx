import {
  FC,
  useRef,
  Dispatch,
  SetStateAction,
  ReactNode,
  KeyboardEvent,
} from 'react';
import { font } from '../../../utils/classnames';
import { TabsContainer, Tab, NavItemInner } from './TabNav.styles';

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
  isDarkMode?: boolean;
};

const TabNavV2: FC<Props> = ({
  id,
  items,
  selectedTab,
  setSelectedTab,
  isDarkMode = false,
}: Props) => {
  const tabListRef = useRef<HTMLDivElement>(null);

  // TODO stole this from BaseTabs. Get together?
  function focusTabAtIndex(index: number): void {
    const element = tabListRef?.current?.querySelector(
      `#tab-${items[index].id}`
    ) as HTMLDivElement;

    element?.focus();
  }

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
    }

    if (RIGHT.includes(key)) {
      setSelectedTab(items[nextIndex].id);
      focusTabAtIndex(nextIndex);
    }

    if (HOME.includes(key)) {
      setSelectedTab(items[0].id);
      focusTabAtIndex(0);
    }

    if (END.includes(key)) {
      setSelectedTab(items[items.length - 1].id);
      focusTabAtIndex(items.length - 1);
    }
  };

  return (
    <div className={font('intb', 5)}>
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
              if (!item.selected) setSelectedTab(item.id);
            }}
            onKeyDown={handleKeyDown}
          >
            <NavItemInner selected={item.selected} isDarkMode={isDarkMode}>
              {item.text}
            </NavItemInner>
          </Tab>
        ))}
      </TabsContainer>
    </div>
  );
};

export default TabNavV2;
