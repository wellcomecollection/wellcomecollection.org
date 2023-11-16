import { FunctionComponent } from 'react';
import Link, { LinkProps } from 'next/link';
import { Wrapper, TabsContainer, Tab, NavItemInner } from './Tabs.styles';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import { IconSvg } from '@weco/common/icons';
import styled from 'styled-components';

const IconWrapper = styled.span`
  div {
    top: 6px;
  }
`;

export type SelectableTextLink = {
  text: string;
  id: string;
  url: string | LinkProps;
  icon?: IconSvg;
};

export type Props = {
  hideBorder?: boolean;
  label: string;
  items: SelectableTextLink[];
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
    <>
      <Wrapper aria-label={label}>
        <TabsContainer data-test-id="sub-nav-tab-container">
          {items.map(item => {
            const isSelected = currentSection === item.id;
            return (
              <Tab
                data-test-id={item.id}
                key={item.id}
                $selected={isSelected}
                $hideBorder={hideBorder}
              >
                <Link
                  scroll={false}
                  passHref
                  href={typeof item.url === 'string' ? item.url : item.url.href}
                  as={typeof item.url === 'string' ? undefined : item.url.as}
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
      </Wrapper>
    </>
  );
};

export default TabsNavigate;
