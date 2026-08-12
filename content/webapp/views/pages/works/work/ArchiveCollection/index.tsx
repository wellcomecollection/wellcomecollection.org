import { ReactNode, useState } from 'react';

import { Container } from '@weco/common/views/components/styled/Container';
import Space from '@weco/common/views/components/styled/Space';
import { Work as WorkType } from '@weco/content/services/wellcome/catalogue/types';
import Tabs from '@weco/content/views/components/Tabs';

import ArchiveCollectionAbout from './ArchiveCollection.About';
import ArchiveCollectionContents from './ArchiveCollection.Contents';
import ArchiveCollectionHero from './ArchiveCollection.Hero';
import ArchiveCollectionRelatedArchives from './ArchiveCollection.RelatedArchives';

const ArchiveCollectionLayout = ({ work }: { work: WorkType }) => {
  const [selectedTab, setSelectedTab] = useState('about');

  const tabsItems = [
    {
      id: 'about',
      text: 'About this archive collection',
      url: '#about', // TODO discuss with Anna & team
      dataGtmProps: { label: 'About this archive collection' },
    },
    {
      id: 'contents',
      text: 'Collection contents',
      url: '#contents',
      dataGtmProps: { label: 'Collection contents' }, // Is this just always the same as the label?
    },
    {
      id: 'related-archives',
      text: 'Related archives',
      url: '#related-archives',
      dataGtmProps: { label: 'Related archives' },
    },
  ];

  const tabPanels: Record<string, ReactNode> = {
    about: <ArchiveCollectionAbout work={work} />,
    contents: <ArchiveCollectionContents />,
    'related-archives': <ArchiveCollectionRelatedArchives />,
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
              hidden={selectedTab !== tab.id}
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
