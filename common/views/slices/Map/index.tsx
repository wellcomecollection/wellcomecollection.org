import { MapSlice as SliceType } from '@weco/common/prismicio-types';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  LayoutWidth,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import { transformMapSlice } from '@weco/content/services/prismic/transformers/body';
import Map from '@weco/content/components/Map/Map';

export type MapProps = SliceComponentProps<SliceType, SliceZoneContext>;

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
