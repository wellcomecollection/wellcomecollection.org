import { FunctionComponent } from 'react';
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
              <Link scroll={false} passHref href={item.url}>
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
                  {item.name}
                </NavItemInner>
              </Link>
            </Tab>
          );
        })}
      </TabsContainer>

      {hasDivider && <Divider color="neutral.300" />}
    </Wrapper>
  );
};

export default SubNavigation;
