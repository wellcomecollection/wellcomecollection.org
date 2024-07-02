import { CollectionVenueSlice as RawCollectionVenueSlice } from '@weco/common/prismicio-types';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import Layout from '@weco/common/views/components/Layout';
import { transformCollectionVenueSlice } from '@weco/content/services/prismic/transformers/body';
import VenueHours from '@weco/content/components/VenueHours/VenueHours';
import VenueClosedPeriods from '@weco/content/components/VenueClosedPeriods/VenueClosedPeriods';

export type CollectionVenueProps = SliceComponentProps<
  RawCollectionVenueSlice,
  SliceZoneContext
>;

// TODO change types to use FunctionComponent
const CollectionVenue = ({
  slice,
  context,
}: CollectionVenueProps): JSX.Element | null => {
  const transformedSlice = transformCollectionVenueSlice(slice);
  if (transformedSlice) {
    return (
      <SpacingComponent $sliceType={transformedSlice.type}>
        {transformedSlice.value.showClosingTimes ? ( // TODO
          <LayoutWidth width={context.minWidth}>
            <VenueClosedPeriods venue={transformedSlice.value.content} />
          </LayoutWidth>
        ) : (
          <Layout
            gridSizes={
              transformedSlice.value.content.isFeatured
                ? {
                    s: 12,
                    m: 12,
                    l: 11,
                    shiftL: 1,
                    xl: 10,
                    shiftXL: 2,
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
          </Layout>
        )}
      </SpacingComponent>
    );
  }
  return null;
};

export default CollectionVenue;
