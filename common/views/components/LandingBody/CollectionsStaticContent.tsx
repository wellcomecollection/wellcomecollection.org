import { useContext } from 'react';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import Space from '@weco/common/views/components/styled/Space';
import TogglesContext from '../TogglesContext/TogglesContext';

const CollectionsStaticContent = () => {
  const { searchPrototype } = useContext(TogglesContext);

  return searchPrototype ? (
    <>
      <Layout12>
        <h2 className="h2">Search the collections</h2>
      </Layout12>
      <Layout12>
        <Space v={{ size: 'm', properties: ['margin-top'] }}>
          <SearchTabs
            worksRouteProps={{
              query: '',
              page: 1,
              workType: [],
              itemsLocationsLocationType: [],
              itemsLocationsType: null,
              sort: null,
              sortOrder: null,
              productionDatesFrom: null,
              productionDatesTo: null,
              search: null,
              imagesColor: null,
              source: 'collections',
            }}
            imagesRouteProps={{
              query: '',
              page: 1,
              source: 'collections',
              locationsLicense: null,
              color: null,
            }}
            workTypeAggregations={[]}
            shouldShowImagesFilters={false}
            shouldShowWorksFilters={false}
            shouldShowDescription={true}
          />
        </Space>
      </Layout12>
    </>
  ) : (
    <Layout12>
      <h2 className="h2">Search the collections</h2>
      <p>
        Find thousands of books, images, artworks, unpublished archives and
        manuscripts in our collections, many of them with free online access.
      </p>
      <SearchForm
        ariaDescribedBy="search-form-description"
        shouldShowFilters={false}
        worksRouteProps={{
          query: '',
          page: 1,
          workType: [],
          itemsLocationsLocationType: [],
          sort: null,
          sortOrder: null,
          productionDatesFrom: null,
          productionDatesTo: null,
          search: null,
        }}
        workTypeAggregations={[]}
      />
    </Layout12>
  );
};

export default CollectionsStaticContent;
