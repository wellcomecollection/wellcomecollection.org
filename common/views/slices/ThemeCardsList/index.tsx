import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { font } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
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
      <ConditionalWrapper
        condition={!!context.gridSizes}
        wrapper={children => (
          <ContaineredLayout gridSizes={context.gridSizes!}>
            {children}
          </ContaineredLayout>
        )}
      >
        {/* TODO move this to the component because it needs alignment with the arrows.... 
        Will need to add a boolean that only displays it if it comes from the slice */}
        {title && <h2 className={font('sans-bold', 2)}>{title}</h2>}
      </ConditionalWrapper>

      <ThemeCardsList
        conceptIds={conceptIds}
        description={asText(slice.primary.description)}
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
