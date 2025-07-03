import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { SearchResultsSlice as RawSearchResultsSlice } from '@weco/common/prismicio-types';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/common/views/components/Body';
import SearchResults from '@weco/common/views/components/SearchResults';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformSearchResultsSlice } from '@weco/content/services/prismic/transformers/body';

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
      <LayoutWidth width={options.minWidth}>
        <SearchResults variant="async" {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default SearchResultsSlice;
