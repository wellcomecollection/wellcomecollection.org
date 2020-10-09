import { useState, useRef, useContext, KeyboardEvent } from 'react';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import styled from 'styled-components';
import { classNames } from '@weco/common/utils/classnames';

const TabList = styled.div.attrs({
  role: 'tablist',
})``;

type TabProps = {
  isActive: boolean;
  tabPanelId: string;
};

const Tab = styled.button.attrs((props: TabProps) => ({
  className: classNames({
    'plain-button no-padding': true,
    'is-active': props.isActive,
  }),
  role: 'tab',
  tabIndex: props.isActive ? 0 : -1,
  'aria-selected': props.isActive,
  'aria-controls': props.tabPanelId,
}))<TabProps>`
  &:focus {
    outline: 0;
  }
`;

type TabPanelProps = {
  id: string;
  isActive: boolean;
  isEnhanced: boolean;
};
const TabPanel = styled.div.attrs((props: TabPanelProps) => ({
  id: props.id,
  role: 'tabpanel',
  hidden: props.isEnhanced && !props.isActive,
  'aria-expanded': props.isActive,
}))<TabPanelProps>``;

type Tab = {
  id: string;
  tab: JSX.Element | string;
  tabPanel: JSX.Element | string;
};

export type Props = {
  label: string;
  tabs: Tab[];
};

const Tabs = ({ label, tabs }: Props) => {
  const [activeId, setActiveId] = useState(tabs[0].id);
  const { isEnhanced } = useContext(AppContext);
  const tabListRef = useRef(null);

  function focusTabAtIndex(index: number): void {
    tabListRef?.current?.querySelector(`#${tabs[index].id}`).focus();
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

    const currentTab = tabs.find(t => t.id === activeId);
    const currentIndex = tabs.indexOf(currentTab);
    const nextIndex = tabs[currentIndex + 1] ? currentIndex + 1 : 0;
    const prevIndex = tabs[currentIndex - 1]
      ? currentIndex - 1
      : tabs.length - 1;

    if (LEFT.includes(key)) {
      setActiveId(tabs[prevIndex].id);
      focusTabAtIndex(prevIndex);
    }

    if (RIGHT.includes(key)) {
      setActiveId(tabs[nextIndex].id);
      focusTabAtIndex(nextIndex);
    }

    if (HOME.includes(key)) {
      setActiveId(tabs[0].id);
      focusTabAtIndex(0);
    }

    if (END.includes(key)) {
      setActiveId(tabs[tabs.length - 1].id);
      focusTabAtIndex(tabs.length - 1);
    }
  }

  return (
    <>
      {isEnhanced && (
        <TabList ref={tabListRef} aria-label={label}>
          {tabs.map(({ id, tab }) => (
            <Tab
              key={id}
              id={id}
              tabPanelId={id}
              isActive={id === activeId}
              onClick={() => setActiveId(id)}
              onKeyDown={handleKeyDown}
            >
              {tab}
            </Tab>
          ))}
        </TabList>
      )}
      {tabs.map(({ id, tab, tabPanel }) => (
        <TabPanel
          key={id}
          id={id}
          isActive={id === activeId}
          isEnhanced={isEnhanced}
        >
          {!isEnhanced && <>{tab}</>}
          {tabPanel}
        </TabPanel>
      ))}
    </>
  );
};

export default Tabs;
