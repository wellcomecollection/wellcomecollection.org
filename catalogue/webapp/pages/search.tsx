import { GetServerSideProps, NextPage } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { AppErrorProps } from '@weco/common/services/app';
import { getServerData } from '@weco/common/server-data';
import CataloguePageLayout from 'components/CataloguePageLayout/CataloguePageLayout';
import TabNav from '@weco/common/views/components/TabNav/TabNav';
import { useState } from 'react';
import Space from '@weco/common/views/components/styled/Space';

export const SearchPage: NextPage = () => {
  const [selectedTab, setSelectedTab] = useState('overview');

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
        <h1 className="visually-hidden">Search Page</h1>
        <TabNav
          id="search-tabs"
          hasDivider
          variant="yellow"
          selectedTab={selectedTab}
          items={[
            {
              id: 'overview',
              text: 'Overview',
              selected: selectedTab === 'overview',
            },
            {
              id: 'exhibitions',
              text: 'Exhibitions and events (1032)',
              selected: selectedTab === 'exhibitions',
            },
            {
              id: 'stories',
              text: 'Stories (1032)',
              selected: selectedTab === 'stories',
            },
            {
              id: 'images',
              text: 'Images (1032)',
              selected: selectedTab === 'images',
            },
            {
              id: 'collections',
              text: 'Collections (1032)',
              selected: selectedTab === 'collections',
            },
          ]}
          setSelectedTab={setSelectedTab}
        />
        <Space v={{ size: 'l', properties: ['margin-top', 'margin-bottom'] }}>
          {selectedTab === 'overview' && (
            <div
              role="tabpanel"
              id="tabpanel-overviewTab"
              aria-labelledby="tab-overviewTab"
            >
              Overview content
            </div>
          )}
          {selectedTab === 'exhibitions' && (
            <div
              role="tabpanel"
              id="tabpanel-exhibitionsTab"
              aria-labelledby="tab-exhibitionsTab"
            >
              Exhibitions and events content
            </div>
          )}
          {selectedTab === 'stories' && (
            <div
              role="tabpanel"
              id="tabpanel-storiesTab"
              aria-labelledby="tab-storiesTab"
            >
              Stories content
            </div>
          )}
          {selectedTab === 'images' && (
            <div
              role="tabpanel"
              id="tabpanel-imagesTab"
              aria-labelledby="tab-imagesTab"
            >
              Images content
            </div>
          )}
          {selectedTab === 'collections' && (
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
