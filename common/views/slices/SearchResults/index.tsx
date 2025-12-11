import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { SearchResultsSlice as RawSearchResultsSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformSearchResultsSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import SearchResults from '@weco/content/views/components/SearchResults';

export type SearchResultsProps = SliceComponentProps<
  RawSearchResultsSlice,
  SliceZoneContext
>;

const SearchResultsSlice: FunctionComponent<SearchResultsProps> = ({
  slice,
  context,
}: SearchResultsProps) => {
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformSearchResultsSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ContaineredLayout gridSizes={options.gridSizes}>
        <SearchResults variant="async" {...transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default SearchResultsSlice;
