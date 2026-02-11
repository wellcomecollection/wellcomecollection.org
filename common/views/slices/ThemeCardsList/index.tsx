import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { asText } from '@weco/content/services/prismic/transformers';
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

  return (
    <SpacingComponent $sliceType={slice.slice_type}>
      <ConditionalWrapper
        condition={!!context.gridSizes}
        wrapper={children => (
          <ContaineredLayout gridSizes={context.gridSizes!}>
            {children}
          </ContaineredLayout>
        )}
      >
        {transformedSlice.value.title && (
          <h2 className={font('sans-bold', 2)}>
            {transformedSlice.value.title}
          </h2>
        )}
      </ConditionalWrapper>

      <ThemeCardsList
        conceptIds={transformedSlice.value.conceptIds}
        description={transformedSlice.value.description}
        gtmData={{
          'category-label': asText(slice.primary.title),
          'category-position-in-list': undefined, // Only for "tabbable" carousels
        }}
        gridSizes={context.gridSizes}
      />
    </SpacingComponent>
  );
};

export default ThemeCardsListSlice;
