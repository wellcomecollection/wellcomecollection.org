import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { asText } from '@weco/content/services/prismic/transformers';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import ThemeCardsList from '@weco/content/views/components/ThemeCardsList';

type ThemeCardsListSliceProps = SliceComponentProps<
  RawThemeCardsListSlice,
  SliceZoneContext
>;

const ThemeCardsListSlice: FunctionComponent<ThemeCardsListSliceProps> = ({
  slice,
  context,
}) => {
  const conceptIds = slice.primary.concepts_list
    .map(concept => asText(concept.concept_id))
    .filter(isNotUndefined);
  if (conceptIds.length === 0) return null;

  const title = asText(slice.primary.title);

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <ThemeCardsList
        conceptIds={conceptIds}
        description={asText(slice.primary.description)}
        sliceTitle={title}
        gtmData={{
          'category-label': title,
          'category-position-in-list': undefined, // Only for "tabbable" carousels
        }}
        gridSizes={context.gridSizes}
      />
    </SpacingComponent>
  );
};

export default ThemeCardsListSlice;
