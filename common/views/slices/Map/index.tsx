import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { MapSlice as RawMapSlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { LayoutWidth, SliceZoneContext } from '@weco/content/views/components/Body';
import Map from '@weco/content/views/components/Map';
import { transformMapSlice } from '@weco/content/services/prismic/transformers/body';

export type MapProps = SliceComponentProps<RawMapSlice, SliceZoneContext>;

const MapSlice: FunctionComponent<MapProps> = ({ slice, context }) => {
  const transformedSlice = transformMapSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <LayoutWidth width={context.minWidth}>
        <Map {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default MapSlice;
