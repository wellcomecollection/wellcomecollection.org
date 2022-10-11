import { GetServerSideProps, NextPage } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import TabNavV2 from '@weco/common/views/components/TabNav/TabNavV2';
import { useState } from 'react';
import Space from '@weco/common/views/components/styled/Space';

export const SearchPage: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState('overview-tab');

  return (
    // TODO review meta info here
    <CataloguePageLayout
      title="Search Page"
      description={'<TBC>'}
      url={{ pathname: `/search`, query: {} }}
      openGraphType={'website'}
      siteSection={'collections'}
      jsonLd={{ '@type': 'WebPage' }}
      hideNewsletterPromo={true}
    >
      <div className="container">
        <h1>Search Page</h1>
        <TabNavV2
          id="search-tabs"
          selectedTab={selectedTab}
          items={[
            {
              id: 'overview-tab',
              text: 'Overview',
              selected: selectedTab === 'overview-tab',
            },
            {
              id: 'exhibitions-tab',
              text: 'Exhibitions and events',
              selected: selectedTab === 'exhibitions-tab',
            },
            {
              id: 'stories-tab',
              text: 'Stories',
              selected: selectedTab === 'stories-tab',
            },
            {
              id: 'images-tab',
              text: 'Images',
              selected: selectedTab === 'images-tab',
            },
            {
              id: 'collections-tab',
              text: 'Collections',
              selected: selectedTab === 'collections-tab',
            },
          ]}
          setSelectedTab={setSelectedTab}
        />
        <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
          {selectedTab === 'overview-tab' && (
            <div
              role="tabpanel"
              id="tabpanel-overviewTab"
              aria-labelledby="tab-overviewTab"
            >
              Overview content
            </div>
          )}
          {selectedTab === 'exhibitions-tab' && (
            <div
              role="tabpanel"
              id="tabpanel-exhibitionsTab"
              aria-labelledby="tab-exhibitionsTab"
            >
              Exhibitions and events content
            </div>
          )}
          {selectedTab === 'stories-tab' && (
            <div
              role="tabpanel"
              id="tabpanel-storiesTab"
              aria-labelledby="tab-storiesTab"
            >
              Stories content
            </div>
          )}
          {selectedTab === 'images-tab' && (
            <div
              role="tabpanel"
              id="tabpanel-imagesTab"
              aria-labelledby="tab-imagesTab"
            >
              Images content
            </div>
          )}
          {selectedTab === 'collections-tab' && (
            <div
              role="tabpanel"
              id="tabpanel-collectionsTab"
              aria-labelledby="tab-collectionsTab"
            >
              Collections content
            </div>
          )}
        </Space>
      </div>
    </CataloguePageLayout>
  );
};

export const getServerSideProps: GetServerSideProps<
  Record<string, unknown> | AppErrorProps
> = async context => {
  const serverData = await getServerData(context);

  if (!serverData.toggles.searchPage) {
    return { notFound: true };
  }

  return {
    props: removeUndefinedProps({
      serverData,
    }),
  };
};

export default SearchPage;
