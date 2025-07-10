import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { CollectionVenueSlice as RawCollectionVenueSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformCollectionVenueSlice } from '@weco/content/services/prismic/transformers/body';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import VenueClosedPeriods from '@weco/content/views/components/VenueClosedPeriods';
import VenueHours from '@weco/content/views/components/VenueHours';

export type CollectionVenueProps = SliceComponentProps<
  RawCollectionVenueSlice,
  SliceZoneContext
>;

const CollectionVenue: FunctionComponent<CollectionVenueProps> = ({
  slice,
  context,
}) => {
  const transformedSlice = transformCollectionVenueSlice(slice);

  if (transformedSlice) {
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        {/* TODO, create variation or consider removing
        https://github.com/wellcomecollection/wellcomecollection.org/issues/11098 */}
        {transformedSlice.value.showClosingTimes ? (
          <LayoutWidth width={context.minWidth}>
            <VenueClosedPeriods venue={transformedSlice.value.content} />
          </LayoutWidth>
        ) : (
          <ContaineredLayout
            gridSizes={
              transformedSlice.value.content.isFeatured
                ? {
                    s: [12],
                    m: [12],
                    l: [12],
                    xl: [10, 2],
                  }
                : {
                    s: [12],
                    m: [10, 2],
                    l: [8, 3],
                    xl: [8, 3],
                  }
            }
          >
            <VenueHours venue={transformedSlice.value.content} />
          </ContaineredLayout>
        )}
      </SpacingComponent>
    );
  }
  return null;
};

export default CollectionVenue;
