import {
  Dispatch,
  FunctionComponent,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
  useRef,
} from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { IconSvg } from '@weco/common/icons';
import { toSnakeCase } from '@weco/common/utils/grammar';
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
  text: ReactNode;
  url?: string;
  icon?: IconSvg;
  gtmData?: {
    category: string;
  };
};

export type Props = {
  hideBorder?: boolean;
  label: string;
  items: SwitchSelectableTextLink[];
  selectedTab: string;
  setSelectedTab: Dispatch<SetStateAction<string>>;
  isWhite?: boolean;
};

const TabsSwitch: FunctionComponent<Props> = ({
  label,
  items,
  hideBorder,
  selectedTab,
  setSelectedTab,
  isWhite,
}: Props) => {
  const { isEnhanced } = useAppContext();
  const tabListRef = useRef<HTMLDivElement>(null);

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
    <TabsContainer
      role={isEnhanced ? 'tablist' : undefined}
      ref={tabListRef}
      aria-label={label}
    >
      {items.map(item => {
        const isSelected = isEnhanced && selectedTab === item.id;
        return (
          <Tab
            key={item.id}
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
                data-gtm-trigger={`tab_${toSnakeCase(label)}`}
                data-gtm-label={item.text}
                data-gtm-category={item.gtmData?.category}
                data-gtm-position-in-list={items.indexOf(item) + 1}
              >
                <NavItemShim>{item.text}</NavItemShim>
                <ConditionalWrapper
                  condition={Boolean(item.url && !isEnhanced)}
                  wrapper={children => <a href={item.url}>{children}</a>}
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
