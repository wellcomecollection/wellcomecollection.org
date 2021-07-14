import {
  useState,
  useRef,
  useContext,
  useCallback,
  KeyboardEvent,
  useEffect,
  ReactElement,
  FunctionComponent,
} from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames';

const TabList = styled.div.attrs({
  role: 'tablist',
})``;
const prefixButton = '-btn';

type TabProps = {
  isActive: boolean;
  tabPanelId: string;
};

const Tab = styled.button.attrs((props: TabProps) => ({
  className: classNames({
    'plain-button no-padding': true,
  }),
  role: 'tab',
  tabIndex: props.isActive ? 0 : -1,
  'aria-selected': props.isActive,
  'aria-controls': props.tabPanelId,
}))<TabProps>`
  cursor: pointer;
  &:focus {
    outline: 0;
  }
  width: 50%;
  ${props => props.theme.media.medium`
    width: auto;
  `}
`;

type TabPanelProps = {
  id: string;
  isActive: boolean;
  isEnhanced: boolean;
};
const TabPanel = styled.div.attrs((props: TabPanelProps) => ({
  id: props.id,
  role: 'tabpanel',
  hidden: !props.isActive,
  'aria-expanded': props.isActive,
}))<TabPanelProps>``;

export type TabType = {
  id: string;
  tab: (isActive: boolean, isFocused: boolean) => ReactElement;
  tabPanel: ReactElement | string;
};

export type Props = {
  label: string;
  tabs: TabType[];
  activeTabIndex?: number;
  onTabClick?: (tabId: string) => void;
  onTabChanged?: (tabId: string) => void;
};

const Tabs: FunctionComponent<Props> = ({
  label,
  tabs,
  activeTabIndex,
  onTabClick,
  onTabChanged,
}: Props): ReactElement<Props> => {
  const [activeId, setActiveId] = useState(tabs[activeTabIndex || 0].id);
  const [focusedId, setFocusedId] = useState<string>();
  const { isEnhanced } = useContext(AppContext);
  const tabListRef = useRef<HTMLDivElement>(null);
  const handleTabClick = useCallback(
    (tabId: string) => {
      onTabClick && onTabClick(tabId);
      setActiveId(tabId);
    },
    [activeId]
  );

  function handleTabChanged(id: string) {
    onTabChanged && onTabChanged(id);
  }

  useEffect(() => {
    handleTabChanged(activeId);
  }, [activeId]);

  function focusTabAtIndex(index: number): void {
    (tabListRef?.current?.querySelector(
      `#${tabs[index].id}`
    ) as HTMLDivElement)?.focus();
  }

  // A11y expectation for Keyboard interaction: https://www.w3.org/TR/wai-aria-practices/#keyboard-interaction-19
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const LEFT = [37, 'ArrowLeft'];
    const RIGHT = [39, 'ArrowRight'];
    const HOME = [36, 'Home'];
    const END = [35, 'End'];
    const key = event.key || event.keyCode;
    const isKeyOfInterest = [...LEFT, ...RIGHT, ...HOME, ...END].includes(key);

    if (!isKeyOfInterest) return;

    event.preventDefault();

    const currentTab = tabs.find(t => t.id === activeId) || tabs[0];
    const currentIndex = tabs.indexOf(currentTab);
    const nextIndex = tabs[currentIndex + 1] ? currentIndex + 1 : 0;
    const prevIndex = tabs[currentIndex - 1]
      ? currentIndex - 1
      : tabs.length - 1;

    if (LEFT.includes(key)) {
      setActiveId(tabs[prevIndex].id);
      setFocusedId(tabs[prevIndex].id);
      focusTabAtIndex(prevIndex);
    }

    if (RIGHT.includes(key)) {
      setActiveId(tabs[nextIndex].id);
      setFocusedId(tabs[nextIndex].id);
      focusTabAtIndex(nextIndex);
    }

    if (HOME.includes(key)) {
      setActiveId(tabs[0].id);
      setFocusedId(tabs[0].id);
      focusTabAtIndex(0);
    }

    if (END.includes(key)) {
      setActiveId(tabs[tabs.length - 1].id);
      setFocusedId(tabs[tabs.length - 1].id);
      focusTabAtIndex(tabs.length - 1);
    }
  }

  return (
    <>
      {/* if isEnhanced then we want to create the tablist to control the panels,
      if not then the tabs will be appear above there respective panel (see below)
      */}
      {isEnhanced &&
        <TabList ref={tabListRef} aria-label={label}>
          {tabs.map(({ id, tab }) => (
            <Tab
              key={`${id}${prefixButton}`}
              id={`${id}${prefixButton}`}
              tabPanelId={id}
              isActive={id === activeId}
              onClick={() => handleTabClick(id)}
              onBlur={() => setFocusedId(undefined)}
              onFocus={() => setFocusedId(id)}
              onKeyDown={handleKeyDown}
            >
              {tab(id === activeId, id === focusedId)}
            </Tab>
          ))}
        </TabList>
      }
      {tabs.map(({ id, tab, tabPanel }) => (
        <>
          {/* if it's not enhanced the tab appears above its related panel */}
          {!isEnhanced && tab(id === activeId, false)}
          <TabPanel
            key={id}
            id={id}
            isActive={id === activeId}
            isEnhanced={isEnhanced}
          >
            {tabPanel}
          </TabPanel>
        </>
      ))}
    </>
  );
};

export default Tabs;
