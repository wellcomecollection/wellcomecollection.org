import { FunctionComponent } from 'react';
import { IconSvg } from '../../../icons';
import {
  Wrapper,
  TabsContainer,
  Tab,
  NavItemInner,
} from './SubNavigation.styles';
import Divider from '../Divider/Divider';
import Icon from '../Icon/Icon';
import Space from '../styled/Space';
import Link from 'next/link';
import styled from 'styled-components';

const IconWrapper = styled.span`
  div {
    top: 6px;
  }
`;

type SelectableTextLink = {
  name: string;
  id: string;
  url: string;
  icon?: IconSvg;
};

type Props = {
  label: string;
  items: SelectableTextLink[];
  currentSection: string;
  variant?: 'yellow' | 'white';
  hasDivider?: boolean;
};

const SubNavigation: FunctionComponent<Props> = ({
  label,
  items,
  variant,
  currentSection,
  hasDivider,
}: Props) => {
  return (
    <Wrapper aria-label={label}>
      <TabsContainer>
        {items.map(item => {
          const isSelected = currentSection === item.id;
          return (
            <Tab key={item.id}>
              <Link
                scroll={false}
                passHref
                href={typeof item.url === 'string' ? item.url : item.url.href}
                as={item.url.as}
              >
                <NavItemInner
                  variant={variant}
                  selected={isSelected}
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
                      h={{ size: 's', properties: ['margin-right'] }}
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

      {hasDivider && <Divider lineColor="neutral.300" />}
    </Wrapper>
  );
};

export default SubNavigation;
