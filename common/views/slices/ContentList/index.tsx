import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ContentListSlice as RawContentListSlice } from '@weco/common/prismicio-types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import SearchResults from '@weco/content/views/components/SearchResults';

export type ContentListProps = SliceComponentProps<
  RawContentListSlice,
  SliceZoneContext
>;

const ContentListSlice: FunctionComponent<ContentListProps> = ({
  slice,
  context,
}) => {
  const options = { ...defaultContext, ...context };

  const transformedSlice = transformContentListSlice(slice);
  if (!options.hasLandingPageFormat) {
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        <ContaineredLayout gridSizes={context.gridSizes}>
          <SearchResults
            variant="async"
            title={transformedSlice.value.title}
            query={transformedSlice.value.items
              .map(item => ('id' in item ? `id:${item.id}` : undefined))
              .filter(isNotUndefined)
              .join(' ')}
          />
        </ContaineredLayout>
      </SpacingComponent>
    );
  }
  return null;
};

export default ContentListSlice;
