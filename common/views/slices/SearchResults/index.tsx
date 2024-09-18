import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { SearchResultsSlice as RawSearchResultsSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import AsyncSearchResults from '@weco/content/components/SearchResults/AsyncSearchResults';
import { transformSearchResultsSlice } from '@weco/content/services/prismic/transformers/body';

export type SearchResultsProps = SliceComponentProps<
  RawSearchResultsSlice,
  SliceZoneContext
>;

const SearchResultsSlice: FunctionComponent<SearchResultsProps> = ({
  slice,
  context,
}: SearchResultsProps): JSX.Element => {
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformSearchResultsSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <LayoutWidth width={options.minWidth}>
        <AsyncSearchResults {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default SearchResultsSlice;
