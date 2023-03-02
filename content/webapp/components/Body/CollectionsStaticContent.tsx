import { FunctionComponent, ReactElement } from 'react';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import { emptyWorksProps } from '@weco/common/views/components/WorksLink/WorksLink';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';

const CollectionsStaticContent: FunctionComponent = (): ReactElement => {
  const { query } = emptyWorksProps;
  return (
    <>
      <Layout12>
        <SpacingSection>
          <SearchTabs query={query} shouldShowDescription={false} />
        </SpacingSection>
      </Layout12>
    </>
  );
};

export default CollectionsStaticContent;
