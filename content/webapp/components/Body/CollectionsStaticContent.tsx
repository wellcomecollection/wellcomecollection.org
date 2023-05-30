import { FunctionComponent } from 'react';
import Layout12 from '@weco/common/views/components/Layout12/Layout12';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';

const CollectionsStaticContent: FunctionComponent = () => {
  return (
    <Layout12>
      <SpacingSection>
        <SearchForm searchCategory="works" location="page" />
      </SpacingSection>
    </Layout12>
  );
};

export default CollectionsStaticContent;
