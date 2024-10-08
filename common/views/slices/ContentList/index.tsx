import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { prismicPageIds } from '@weco/common/data/hardcoded-ids';
import { ContentListSlice as RawContentListSlice } from '@weco/common/prismicio-types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  defaultContext,
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import AsyncSearchResults from '@weco/content/components/SearchResults/AsyncSearchResults';
import SearchResults from '@weco/content/components/SearchResults/SearchResults';
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
          {/* FIXME: this makes what-we-do contentLists synchronous, but it's hacky. */}
          {/* TODO what-we-do was archived in Sept '23 so can probably remove this code and the redirects */}
          {options.pageId === prismicPageIds.whatWeDo ? (
            <SearchResults
              title={transformedSlice.value.title}
              items={transformedSlice.value.items}
            />
          ) : (
            <AsyncSearchResults
              title={transformedSlice.value.title}
              query={transformedSlice.value.items
                .map(item => ('id' in item ? `id:${item.id}` : undefined))
                .filter(isNotUndefined)
                .join(' ')}
            />
          )}
        </LayoutWidth>
      </SpacingComponent>
    );
  }
  return null;
};

export default ContentListSlice;
