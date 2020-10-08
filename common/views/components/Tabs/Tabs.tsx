import { useState, useRef } from 'react';
import styled from 'styled-components';

const TabList = styled.div.attrs({
  role: 'tablist',
})``;

type TabProps = {
  isActive: boolean;
  tabPanelId: string;
};

const Tab = styled.button.attrs((props: TabProps) => ({
  className: 'plain-button',
  role: 'tab',
  'aria-selected': props.isActive,
  'aria-controls': props.tabPanelId,
}))<TabProps>``;

type TabPanelProps = {
  id: string;
  isActive: boolean;
};
const TabPanel = styled.div.attrs((props: TabPanelProps) => ({
  id: props.id,
  role: 'tabpanel',
  hidden: !props.isActive,
  'aria-expanded': props.isActive,
}))<TabPanelProps>``;

type Tab = {
  id: string;
  tab: JSX.Element | string;
  tabPanel: JSX.Element | string;
};

type Props = {
  tabs: Tab[];
};

const Tabs = ({ tabs }) => {
  // TODO: store all tabs with ids and trigger up/down through ids instead of triggerTab?

  const [activeId, setActiveId] = useState(tabs[0].id);
  const tabListRef = useRef(null);

  // A11y expectation is that arrow keys should move between tabs
  function triggerTab(event) {
    const LEFT = 37;
    const UP = 38;
    const RIGHT = 39;
    const DOWN = 40;

    const isArrowKey = [LEFT, UP, RIGHT, DOWN].includes(event.keyCode);
    const current = tabs.find(t => t.id === activeId);
    const currentIndex = tabs.indexOf(current);
    const nextIndex = tabs[currentIndex + 1] || tabs[0];
    const prevIndex = tabs[currentIndex - 1] || tabs[tabs.length - 1];

    if ([LEFT, UP].includes(event.keyCode)) {
      // left
    }
    if ([RIGHT, DOWN].includes(event.keyCode)) { // right }
  }

  return (
    <>
      <TabList ref={tabListRef}>
        {tabs.map(({ id, tab }) => (
          <Tab
            key={id}
            tabPanelId={id}
            isActive={id === activeId}
            onClick={() => setActiveId(id)}
            onKeyDown={event => triggerTab(event)}
          >
            {tab}
          </Tab>
        ))}
      </TabList>
      {tabs.map(({ id, tabPanel }) => (
        <TabPanel key={id} id={id} isActive={id === activeId}>
          {tabPanel}
        </TabPanel>
      ))}
    </>
  );
};

export default Tabs;
