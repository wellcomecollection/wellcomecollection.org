import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { CollectionVenueSlice as RawCollectionVenueSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformCollectionVenueSlice } from '@weco/content/services/prismic/transformers/body';
import {
  defaultContext,
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
  const options = { ...defaultContext, ...context };
  const transformedSlice = transformCollectionVenueSlice(slice);

  if (transformedSlice) {
    const closingTimesContent = (
      <VenueClosedPeriods venue={transformedSlice.value.content} />
    );
    const venueHoursContent = (
      <VenueHours venue={transformedSlice.value.content} />
    );

    return (
      <SpacingComponent
        $sliceType={transformedSlice.type}
        $sliceId={options.stickyNavA11y ? slice.id : undefined}
        $useSectionElement={options.stickyNavA11y}
      >
        {/* TODO, create variation or consider removing
        https://github.com/wellcomecollection/wellcomecollection.org/issues/11098 */}
        {transformedSlice.value.showClosingTimes ? (
          options.isInGridCell && options.stickyNavA11y ? (
            closingTimesContent
          ) : (
            <LayoutWidth width={context.minWidth}>
              {closingTimesContent}
            </LayoutWidth>
          )
        ) : options.isInGridCell && options.stickyNavA11y ? (
          venueHoursContent
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
            {venueHoursContent}
          </ContaineredLayout>
        )}
      </SpacingComponent>
    );
  }
  return null;
};

export default CollectionVenue;
