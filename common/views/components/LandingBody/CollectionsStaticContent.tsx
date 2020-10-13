import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';

const CollectionsStaticContent = () => {
  return (
    <>
      <Layout12>
        <h2 className="h2">Search the collections</h2>
        <p>
          Find thousands of books, images, artworks, unpublished archives and
          manuscripts in our collections, many of them with free online access.
        </p>
      </Layout12>
      <Layout12>
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
          shouldShowFilters={false}
        />
      </Layout12>
    </>
  );
};

export default CollectionsStaticContent;
