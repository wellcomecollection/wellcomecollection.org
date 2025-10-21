import Link from 'next/link';
import { FunctionComponent, ReactNode } from 'react';
import styled from 'styled-components';

import { font } from '@weco/common/utils/classnames';

const TabsContainer = styled.div`
  border-bottom: 1px solid ${props => props.theme.color('neutral.400')};
`;

const TabsList = styled.ul`
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  gap: ${props => props.theme.spacingUnit * 2}px;

  ${props => props.theme.media('medium')`
    gap: ${props.theme.spacingUnit * 4}px;
  `}
`;

const TabItem = styled.li`
  margin: 0;
  padding: 0;
`;

const TabLink = styled(Link)<{ $isActive: boolean }>`
  display: block;
  padding: ${props => props.theme.spacingUnit * 2}px 0;
  text-decoration: none;
  color: ${props =>
    props.$isActive
      ? props.theme.color('black')
      : props.theme.color('neutral.600')};
  border-bottom: 3px solid
    ${props =>
      props.$isActive
        ? props.theme.color('accent.lightBlue')
        : 'transparent'};
  font-weight: ${props => (props.$isActive ? 700 : 400)};
  transition:
    color 200ms ease,
    border-color 200ms ease;

  &:hover,
  &:focus {
    color: ${props => props.theme.color('black')};
  }
`;

const TabText = styled.span.attrs({
  className: font('intb', 5),
})``;

export type Tab = {
  label: string;
  href: string;
  isActive: boolean;
};

type Props = {
  tabs: Tab[];
  ariaLabel?: string;
  children?: ReactNode;
};

const Tabs: FunctionComponent<Props> = ({
  tabs,
  ariaLabel = 'Browse options',
  children,
}) => {
  return (
    <div>
      <TabsContainer role="navigation" aria-label={ariaLabel}>
        <TabsList role="tablist">
          {tabs.map(tab => (
            <TabItem key={tab.href} role="presentation">
              <TabLink
                href={tab.href}
                role="tab"
                aria-selected={tab.isActive}
                aria-current={tab.isActive ? 'page' : undefined}
                $isActive={tab.isActive}
              >
                <TabText>{tab.label}</TabText>
              </TabLink>
            </TabItem>
          ))}
        </TabsList>
      </TabsContainer>
      {children && <div role="tabpanel">{children}</div>}
    </div>
  );
};

export default Tabs;
