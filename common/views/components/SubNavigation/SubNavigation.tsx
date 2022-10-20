import { FC } from 'react';
import {
  Wrapper,
  TabsContainer,
  Tab,
  NavItemInner,
} from './SubNavigation.styles';
import Divider from '@weco/common/views/components/Divider/Divider';
import Link from 'next/link';

type SelectableTextLink = {
  name: string;
  id: string;
  url: string;
};

type Props = {
  label: string;
  items: SelectableTextLink[];
  currentSection: string;
  variant?: 'yellow' | 'white';
  hasDivider?: boolean;
};

const TabNav: FC<Props> = ({
  label,
  items,
  variant,
  currentSection,
  hasDivider,
}: Props) => {
  return (
    <Wrapper aria-label={label}>
      <TabsContainer>
        {items.map(item => (
          <Tab key={item.id}>
            <Link scroll={false} passHref href={item.url}>
              <NavItemInner
                variant={variant}
                selected={currentSection === item.id}
                aria-current={currentSection === item.id ? 'page' : 'false'}
              >
                {item.name}
              </NavItemInner>
            </Link>
          </Tab>
        ))}
      </TabsContainer>

      {hasDivider && <Divider color="neutral.300" />}
    </Wrapper>
  );
};

export default TabNav;
