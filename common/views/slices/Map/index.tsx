import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { MapSlice as RawMapSlice } from '@weco/common/prismicio-types';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformMapSlice } from '@weco/content/services/prismic/transformers/body';
import { SliceZoneContext } from '@weco/content/views/components/Body';
import Map from '@weco/content/views/components/Map';

export type MapProps = SliceComponentProps<RawMapSlice, SliceZoneContext>;

const MapSlice: FunctionComponent<MapProps> = ({ slice, context }) => {
  const transformedSlice = transformMapSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ContaineredLayout gridSizes={context.gridSizes}>
        <Map {...transformedSlice.value} />
      </ContaineredLayout>
    </SpacingComponent>
  );
};

export default MapSlice;
