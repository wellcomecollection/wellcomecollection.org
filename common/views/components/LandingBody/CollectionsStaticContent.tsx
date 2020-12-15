import { FunctionComponent, ReactElement } from 'react';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import Space from '@weco/common/views/components/styled/Space';

const CollectionsStaticContent: FunctionComponent = (): ReactElement => {
  return (
    <>
      <Layout12>
        <h2 className="h2">Search the collections</h2>
      </Layout12>
      <Layout12>
        <Space v={{ size: 'm', properties: ['margin-top'] }}>
          <SearchTabs
            shouldShowFilters={false}
            showSortBy={false}
            worksRouteProps={{
              query: '',
              page: 1,
              workType: [],
              itemsLocationsLocationType: [],
              itemsLocationsType: [],
              sort: null,
              sortOrder: null,
              productionDatesFrom: null,
              productionDatesTo: null,
              search: null,
              imagesColor: null,
              source: 'collections',
              color: null,
            }}
            imagesRouteProps={{
              query: '',
              page: 1,
              source: 'collections',
              locationsLicense: null,
              color: null,
              workType: [],
              itemsLocationsLocationType: [],
              itemsLocationsType: [],
              sort: null,
              sortOrder: null,
              productionDatesFrom: null,
              productionDatesTo: null,
              imagesColor: null,
              search: null,
            }}
            workTypeAggregations={[]}
            shouldShowDescription={true}
            disableLink={true}
          />
        </Space>
      </Layout12>
    </>
  );
};

export default CollectionsStaticContent;
