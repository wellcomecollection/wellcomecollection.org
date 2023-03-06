import { FunctionComponent, ReactElement } from 'react';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchTabs from '@weco/common/views/components/SearchTabs/SearchTabs';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';

const CollectionsStaticContent: FunctionComponent = (): ReactElement => {
  return (
    <Layout12>
      <SpacingSection>
        <SearchTabs query="" />
      </SpacingSection>
    </Layout12>
  );
};

export default CollectionsStaticContent;
