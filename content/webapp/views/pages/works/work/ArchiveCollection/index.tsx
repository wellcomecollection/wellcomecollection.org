import { ReactNode, useState } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';
import Tabs from '@weco/content/views/components/Tabs';

import ArchiveCollectionAbout from './ArchiveCollection.About';
import ArchiveCollectionContents from './ArchiveCollection.Contents';
import ArchiveCollectionHero from './ArchiveCollection.Hero';

const ArchiveCollectionLayout = ({ work }: { work: WorkType }) => {
  const { isEnhanced } = useAppContext();
  const [selectedTab, setSelectedTab] = useState('about');

  const tabsItems = [
    {
      id: 'about',
      text: 'About this archive collection',
      url: '#tabpanel-about',
    },
    {
      id: 'contents',
      text: 'Collection contents',
      url: '#tabpanel-contents',
    },
  ];

  const tabPanels: Record<string, ReactNode> = {
    about: <ArchiveCollectionAbout work={work} />,
    contents: <ArchiveCollectionContents work={work} />,
  };

  return (
    <>
      <ArchiveCollectionHero work={work} />

      <Container>
        <Space $v={{ size: 'xl', properties: ['margin-bottom'] }}>
          <Space
            $v={{ size: 'md', properties: ['margin-top', 'margin-bottom'] }}
          >
            <Tabs
              tabBehaviour="switch"
              label="Archive Collection Tabs"
              items={tabsItems}
              selectedTab={selectedTab}
              setSelectedTab={setSelectedTab}
            />
          </Space>

          {tabsItems.map(tab => (
            <div
              key={tab.id}
              role="tabpanel"
              id={`tabpanel-${tab.id}`}
              aria-labelledby={`tab-${tab.id}`}
              hidden={isEnhanced && selectedTab !== tab.id}
            >
              {tabPanels[tab.id]}
            </div>
          ))}
        </Space>
      </Container>
    </>
  );
};

export default ArchiveCollectionLayout;
