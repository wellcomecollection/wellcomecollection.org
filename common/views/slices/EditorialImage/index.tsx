import { EditorialImageSlice as SliceType } from '../../../prismicio-types';
import { FunctionComponent } from 'react';
import { SliceComponentProps } from '@prismicio/react';
import SpacingComponent from '../../components/styled/SpacingComponent';
import {
  LayoutWidth,
  defaultContext,
  SliceZoneContext,
} from '@weco/content/components/Body/Body';
import CaptionedImage from '@weco/content/components/CaptionedImage/CaptionedImage';
import { transformEditorialImageSlice } from '@weco/content/services/prismic/transformers/body';
import Layout, { gridSize12 } from '@weco/common/views/components/Layout';

export type EditorialImageSliceProps = SliceComponentProps<
  SliceType,
  SliceZoneContext
>;

const EditorialImageSlice: FunctionComponent<EditorialImageSliceProps> = ({
  slice,
  context,
}) => {
  const transformedSlice = transformEditorialImageSlice(slice);

  const options = { ...defaultContext, context };
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      {transformedSlice.weight === 'default' && (
        <LayoutWidth width={options.isVisualStory ? 8 : 10}>
          <CaptionedImage {...transformedSlice.value} />
        </LayoutWidth>
      )}

      {transformedSlice.weight === 'standalone' && (
        <Layout gridSizes={gridSize12()}>
          <CaptionedImage {...transformedSlice.value} />
        </Layout>
      )}

      {transformedSlice.weight === 'supporting' && (
        <LayoutWidth width={options.minWidth}>
          <CaptionedImage {...transformedSlice.value} />
        </LayoutWidth>
      )}
    </SpacingComponent>
  );
};

export default EditorialImageSlice;
