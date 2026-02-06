import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { ThemeCardsListSlice as RawThemeCardsListSlice } from '@weco/common/prismicio-types';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { asText } from '@weco/content/services/prismic/transformers';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import ThemeCardsList from '@weco/content/views/components/ThemeCardsList';

export type ThemeCardsListProps = SliceComponentProps<
  RawThemeCardsListSlice,
  SliceZoneContext
>;

const ThemeCardsListSlice: FunctionComponent<ThemeCardsListProps> = ({
  slice,
  context,
}) => {
  const conceptIds = slice.primary.concepts_list
    .map(concept => asText(concept.concept_id))
    .filter(isNotUndefined);
  if (conceptIds.length === 0) return null;

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
        <ThemeCardsList
          conceptIds={conceptIds}
          title={asText(slice.primary.title)}
          description={asText(slice.primary.description)}
        />
      </ConditionalWrapper>
    </SpacingComponent>
  );
};

export default ThemeCardsListSlice;
