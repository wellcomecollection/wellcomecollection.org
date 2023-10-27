import { FunctionComponent } from 'react';
import Link, { LinkProps } from 'next/link';
import {
  Wrapper,
  TabsContainer,
  Tab,
  NavItemInner,
  DividerWrapper,
} from './SubNavigation.styles';
import Divider from '@weco/common/views/components/Divider/Divider';
import Space from '@weco/common/views/components/styled/Space';
import Icon from '@weco/common/views/components/Icon/Icon';
import { IconSvg } from '@weco/common/icons';
import styled from 'styled-components';

const IconWrapper = styled.span`
  div {
    top: 6px;
  }
`;

type SelectableTextLink = {
  name: string;
  id: string;
  url: string | LinkProps;
  icon?: IconSvg;
};

type Props = {
  label: string;
  items: SelectableTextLink[];
  currentSection: string;
  hasDivider?: boolean;
};

const SubNavigation: FunctionComponent<Props> = ({
  label,
  items,
  currentSection,
  hasDivider,
}: Props) => {
  return (
    <>
      <Wrapper aria-label={label}>
        <TabsContainer data-test-id="sub-nav-tab-container">
          {items.map(item => {
            const isSelected = currentSection === item.id;
            return (
              <Tab data-test-id={item.id} key={item.id}>
                <Link
                  scroll={false}
                  passHref
                  href={typeof item.url === 'string' ? item.url : item.url.href}
                  as={typeof item.url === 'string' ? undefined : item.url.as}
                  legacyBehavior
                >
                  <NavItemInner
                    $selected={isSelected}
                    aria-current={isSelected ? 'page' : 'false'}
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
                    {item.name}
                  </NavItemInner>
                </Link>
              </Tab>
            );
          })}
        </TabsContainer>
      </Wrapper>
      {hasDivider && (
        <DividerWrapper>
          <Divider lineColor="neutral.300" />
        </DividerWrapper>
      )}
    </>
  );
};

export default SubNavigation;
