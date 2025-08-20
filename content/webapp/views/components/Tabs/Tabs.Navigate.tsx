import Link, { LinkProps } from 'next/link';
import { FunctionComponent } from 'react';

import { IconSvg } from '@weco/common/icons';
import Icon from '@weco/common/views/components/Icon';
import Space from '@weco/common/views/components/styled/Space';

import {
  IconWrapper,
  NavItemInner,
  NavItemShim,
  Tab,
  TabsContainer,
} from './Tabs.styles';

export type NavigateSelectableTextLink = {
  id: string;
  text: string;
  url: string | LinkProps;
  icon?: IconSvg;
};

export type Props = {
  hideBorder?: boolean;
  label: string;
  items: NavigateSelectableTextLink[];
  currentSection: string;
  isWhite?: boolean;
};

const TabsNavigate: FunctionComponent<Props> = ({
  hideBorder,
  label,
  items,
  currentSection,
  isWhite,
}: Props) => {
  return (
    <TabsContainer aria-label={label}>
      {items.map(item => {
        const isSelected = currentSection === item.id;
        return (
          <Tab key={item.id} $selected={isSelected} $hideBorder={hideBorder}>
            <Link
              scroll={false}
              href={typeof item.url === 'string' ? item.url : item.url.href}
            >
              <NavItemInner
                $selected={isSelected}
                aria-current={isSelected ? 'page' : 'false'}
                $isWhite={isWhite}
                onClick={e => {
                  if (!isSelected) {
                    (e.target as HTMLDivElement).scrollIntoView({
                      behavior: 'smooth',
                      inline: 'center',
                      block: 'nearest',
                    });
                  }
                }}
              >
                <NavItemShim>{item.text}</NavItemShim>
                {item.icon && (
                  <Space
                    as="span"
                    $h={{ size: 's', properties: ['margin-right'] }}
                  >
                    <IconWrapper>
                      <Icon icon={item.icon} />
                    </IconWrapper>
                  </Space>
                )}
                {item.text}
              </NavItemInner>
            </Link>
          </Tab>
        );
      })}
    </TabsContainer>
  );
};

export default TabsNavigate;
