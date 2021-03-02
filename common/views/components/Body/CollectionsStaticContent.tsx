import { FunctionComponent, ReactElement } from 'react';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import { emptyWorksProps } from '../WorksLink/WorksLink';

const CollectionsStaticContent: FunctionComponent = (): ReactElement => {
  const { query, sort, sortOrder } = emptyWorksProps;
  return (
    <>
      <Layout12>
        <h2 className="h2">Search the collections</h2>
      </Layout12>
      <Layout12>
        <SearchTabs
          query={query}
          sort={sort}
          sortOrder={sortOrder}
          worksFilters={[]}
          imagesFilters={[]}
          shouldShowDescription={false}
          shouldShowFilters={false}
          showSortBy={false}
        />
      </Layout12>
    </>
  );
};

export default CollectionsStaticContent;
