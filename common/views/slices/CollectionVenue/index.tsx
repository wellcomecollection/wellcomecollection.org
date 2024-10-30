import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { CollectionVenueSlice as RawCollectionVenueSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import VenueClosedPeriods from '@weco/content/components/VenueClosedPeriods/VenueClosedPeriods';
import VenueHours from '@weco/content/components/VenueHours';
import { transformCollectionVenueSlice } from '@weco/content/services/prismic/transformers/body';

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
                    s: 12,
                    m: 12,
                    l: 12,
                    xl: 10,
                    shiftXL: 1,
                  }
                : {
                    s: 12,
                    m: 10,
                    shiftM: 1,
                    l: 8,
                    shiftL: 2,
                    xl: 8,
                    shiftXL: 2,
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
