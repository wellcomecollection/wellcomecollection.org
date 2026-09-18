import { useRouter } from 'next/router';
import {
  Dispatch,
  FunctionComponent,
  KeyboardEvent,
  SetStateAction,
  useEffect,
  useRef,
} from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { IconSvg } from '@weco/common/icons';
import { toSnakeCase } from '@weco/common/utils/grammar';
import { DataGtmProps, dataGtmPropsToAttributes } from '@weco/common/utils/gtm';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

import {
  IconWrapper,
  NavItemInner,
  NavItemShim,
  Tab,
  TabButton,
  TabsContainer,
} from './Tabs.styles';

type SwitchSelectableTextLink = {
  id: string;
  text: string;
  url?: string;
  icon?: IconSvg;
  dataGtmProps?: { label: DataGtmProps['label'] };
};

export type Props = {
  hideBorder?: boolean;
  label: string;
  items: SwitchSelectableTextLink[];
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  isWhite?: boolean;
};

// Href for the no-JS fallback link - has to match the tabpanel's actual DOM
// id, so the browser can natively jump straight to that content.
const getNoJsAnchorId = (item: SwitchSelectableTextLink) =>
  (item.url ?? `#tabpanel-${item.id}`).replace(/^#/, '');

// URL anchor used once JS is driving tab switches. Matches the id we put on
// the Tab itself (not the tabpanel), so Next's router - which scrolls to the
// element matching the hash, or resets scroll to the top if it finds none -
// lands on the tab control rather than fighting our own scroll handling.
const getJsAnchorId = (item: SwitchSelectableTextLink) => item.id;

const findItemForAnchor = (
  items: SwitchSelectableTextLink[],
  anchorId: string
) =>
  items.find(
    item =>
      getJsAnchorId(item) === anchorId || getNoJsAnchorId(item) === anchorId
  );

const TabsSwitch: FunctionComponent<Props> = ({
  label,
  items,
  hideBorder,
  selectedTab,
  setSelectedTab,
  isWhite,
}: Props) => {
  const { isEnhanced } = useAppContext();
  const router = useRouter();
  const tabListRef = useRef<HTMLDivElement>(null);
  const hasSyncedFromUrlRef = useRef(false);

  function scrollTabIntoView(id: string): void {
    const element = tabListRef?.current?.querySelector(`#tab-${id}`);
    element?.scrollIntoView({
      behavior: 'smooth',
      inline: 'start',
      block: 'nearest',
    });
  }

  // Open the tab matching the URL anchor on load. Scroll to the tab control
  // itself, rather than the tabpanel content the anchor would otherwise
  // point at, since with JS it's the tab list that orients the user.
  useEffect(() => {
    if (!hasSyncedFromUrlRef.current) {
      hasSyncedFromUrlRef.current = true;
      const hash = window.location.hash.slice(1);
      // No anchor means the first tab, not "whatever the parent defaulted to".
      const matchingItem = hash ? findItemForAnchor(items, hash) : items[0];
      if (matchingItem && matchingItem.id !== selectedTab) {
        setSelectedTab(matchingItem.id);
        scrollTabIntoView(matchingItem.id);
        return;
      }
    }

    // Only correct an anchor that's already recognised as this tab's own
    // no-JS anchor (e.g. normalising a "tabpanel"-prefixed link). Leave any
    // other existing fragment alone - it might belong to something else on
    // the page (e.g. a concept page's own #works/#images anchors), and a
    // fresh, anchor-less URL should stay that way until the user actually
    // switches tabs.
    const selectedItem = items.find(item => item.id === selectedTab);
    const hash = window.location.hash.slice(1);
    if (
      selectedItem &&
      hash === getNoJsAnchorId(selectedItem) &&
      hash !== getJsAnchorId(selectedItem)
    ) {
      router.replace(
        `${window.location.pathname}${window.location.search}#${getJsAnchorId(selectedItem)}`,
        undefined,
        { shallow: true, scroll: false }
      );
    }
    // items is only read above on the initial mount pass (it's static per
    // page load); re-running this for every parent re-render isn't needed.
  }, [selectedTab]);

  // Also respond to hash changes that happen without a full page load, e.g.
  // clicking an in-page link to one of the tab anchors, or browser back/forward
  // stepping between anchors this component itself pushed (see pushAnchor).
  useEffect(() => {
    const onHashChange = () => {
      const hash = window.location.hash.slice(1);
      // No anchor (e.g. navigating back past the first tab switch) means the
      // first tab, not leaving whatever was previously selected in place.
      const matchingItem = hash ? findItemForAnchor(items, hash) : items[0];
      if (matchingItem && matchingItem.id !== selectedTab) {
        setSelectedTab(matchingItem.id);
        scrollTabIntoView(matchingItem.id);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [items, selectedTab, setSelectedTab]);

  // Pushes a new history entry for a user-driven tab switch (click or
  // keyboard), so back/forward can step through previously selected tabs.
  // Goes through Next's router (shallow, so it doesn't re-run data fetching)
  // rather than a raw history.pushState - a raw call leaves the entry with
  // state: null, which Next's own popstate handler doesn't recognise, so it
  // silently ignores back/forward through it instead of navigating.
  function pushAnchor(item: SwitchSelectableTextLink): void {
    const anchor = `#${getJsAnchorId(item)}`;
    if (window.location.hash !== anchor) {
      router.push(
        `${window.location.pathname}${window.location.search}${anchor}`,
        undefined,
        { shallow: true, scroll: false }
      );
    }
  }

  function focusTabAtIndex(index: number): void {
    const element = tabListRef?.current?.querySelector(
      `#tab-${items[index].id}`
    ) as HTMLDivElement;

    element?.focus();
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
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
      pushAnchor(items[prevIndex]);
      setSelectedTab(items[prevIndex].id);
      focusTabAtIndex(prevIndex);
    }

    if (RIGHT.includes(key)) {
      pushAnchor(items[nextIndex]);
      setSelectedTab(items[nextIndex].id);
      focusTabAtIndex(nextIndex);
    }

    if (HOME.includes(key)) {
      pushAnchor(items[0]);
      setSelectedTab(items[0].id);
      focusTabAtIndex(0);
    }

    if (END.includes(key)) {
      pushAnchor(items[items.length - 1]);
      setSelectedTab(items[items.length - 1].id);
      focusTabAtIndex(items.length - 1);
    }
  };

  return (
    <TabsContainer
      role={isEnhanced ? 'tablist' : undefined}
      ref={tabListRef}
      aria-label={label}
    >
      {items.map((item, index) => {
        const isSelected = isEnhanced && selectedTab === item.id;
        const url = `#${getNoJsAnchorId(item)}`;

        return (
          <Tab
            key={item.id}
            id={item.id}
            $selected={isSelected}
            $isWhite={isWhite}
            $hideBorder={hideBorder}
            onClick={e => {
              if (!(item.id === selectedTab)) {
                (e.target as HTMLButtonElement).scrollIntoView({
                  behavior: 'smooth',
                  inline: 'start',
                  block: 'nearest',
                });

                pushAnchor(item);
                setSelectedTab(item.id);
              }
            }}
            onKeyDown={handleKeyDown}
          >
            <TabButton
              role={isEnhanced ? 'tab' : undefined}
              id={`tab-${item.id}`}
              tabIndex={item.id === selectedTab ? 0 : -1}
              aria-controls={`tabpanel-${item.id}`}
              aria-selected={item.id === selectedTab}
            >
              <NavItemInner
                $selected={isSelected}
                $isWhite={isWhite}
                {...dataGtmPropsToAttributes({
                  label: item.text,
                  ...item.dataGtmProps,
                  trigger: `tab_${toSnakeCase(label)}`,
                  'position-in-list': `${index + 1}`,
                })}
              >
                <NavItemShim>{item.text}</NavItemShim>
                <ConditionalWrapper
                  condition={!isEnhanced}
                  wrapper={children => <a href={url}>{children}</a>}
                >
                  {item.icon && (
                    <Space
                      as="span"
                      $h={{ size: 'xs', properties: ['margin-right'] }}
                    >
                      <IconWrapper>
                        <Icon icon={item.icon} />
                      </IconWrapper>
                    </Space>
                  )}
                  {item.text}
                </ConditionalWrapper>
              </NavItemInner>
            </TabButton>
          </Tab>
        );
      })}
    </TabsContainer>
  );
};

export default TabsSwitch;
