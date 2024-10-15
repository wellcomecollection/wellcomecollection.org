import { FunctionComponent } from 'react';

import {
  ContaineredLayout,
  gridSize12,
} from '@weco/common/views/components/Layout';
import SearchForm from '@weco/common/views/components/SearchForm/SearchForm';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';

const CollectionsStaticContent: FunctionComponent = () => {
  return (
    <ContaineredLayout gridSizes={gridSize12()}>
      <SpacingSection>
        <SearchForm searchCategory="works" location="page" />
      </SpacingSection>
    </ContaineredLayout>
  );
};

export default CollectionsStaticContent;
