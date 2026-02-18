import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformThemeCardsList } from '@weco/content/services/prismic/transformers/body';
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
  const transformedSlice = transformThemeCardsList(slice);

  if (transformedSlice.value.conceptIds.length === 0) return null;

  const title = transformedSlice.value.title;

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <ThemeCardsList
        sliceTitle={title}
        conceptIds={transformedSlice.value.conceptIds}
        description={transformedSlice.value.description}
        gtmData={{
          'category-label': title,
          'category-position-in-list': undefined, // Only for "tabbable" carousels
        }}
        gridSizes={context.gridSizes}
        useShim={context.hasNoShim ? false : true}
      />
    </SpacingComponent>
  );
};

export default ThemeCardsListSlice;
