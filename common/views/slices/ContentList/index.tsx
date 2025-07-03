import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ContentListSlice as RawContentListSlice } from '@weco/common/prismicio-types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/common/views/components/Body';
import SearchResults from '@weco/common/views/components/SearchResults';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformContentListSlice } from '@weco/content/services/prismic/transformers/body';

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
  if (!options.isLanding) {
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        <LayoutWidth width={context.minWidth}>
          <SearchResults
            variant="async"
            title={transformedSlice.value.title}
            query={transformedSlice.value.items
              .map(item => ('id' in item ? `id:${item.id}` : undefined))
              .filter(isNotUndefined)
              .join(' ')}
          />
        </LayoutWidth>
      </SpacingComponent>
    );
  }
  return null;
};

export default ContentListSlice;
