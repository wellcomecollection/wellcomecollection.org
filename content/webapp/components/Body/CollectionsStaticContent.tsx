import { FunctionComponent } from 'react';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import { propsToQuery } from '@weco/common/utils/routes';
import { ParsedUrlQuery } from 'querystring';
const CollectionsStaticContent: FunctionComponent = () => {
  return (
    <Layout12>
      <SpacingSection>
        <SearchForm
          query=""
          linkResolver={params => {
            const queryWithSource = propsToQuery(params);
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { source = undefined, ...queryWithoutSource } = {
              ...queryWithSource,
            };

            const as = {
              pathname: '/search/works',
              query: queryWithoutSource as ParsedUrlQuery,
            };

            const href = {
              pathname: '/search/works',
              query: queryWithSource,
            };

            return { href, as };
          }}
          ariaDescribedBy="library-catalogue-form-description"
          isImageSearch={false}
        />
      </SpacingSection>
    </Layout12>
  );
};

export default CollectionsStaticContent;
