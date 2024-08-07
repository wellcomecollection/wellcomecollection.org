import { EditorialImageSlice as RawEditorialImageSlice } from '@weco/common/prismicio-types';
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

export type EditorialImageSliceProps = SliceComponentProps<
  RawEditorialImageSlice,
  SliceZoneContext
>;

const EditorialImageSlice: FunctionComponent<EditorialImageSliceProps> = ({
  slice,
  context,
}) => {
  const transformedSlice = transformEditorialImageSlice(slice);

  const options = { ...defaultContext, ...context };
  const width = transformedSlice.value.image.width;
  const height = transformedSlice.value.image.height;
  const widthDividedByHeight = width / height;

  const aspectRatio = () => {
    switch (true) {
      case widthDividedByHeight >= 0.9 && widthDividedByHeight <= 1.1:
        return 'square';
      case widthDividedByHeight > 1.1:
        return 'landscape';
      case widthDividedByHeight < 0.9:
        return 'portrait';
    }
  };

  // Our images are constrained by viewport height so that they will always fit
  // on the screen, but we want to make them feel proportionally similar
  // regardless of their aspect ratio. To do this we can set the _maximum_
  // number of columns that they're allowed to fill in width (but with no
  // guarantees that they will get to that width because of the height
  // constraint)
  const maxColumns =
    options.isVisualStory || aspectRatio() === 'portrait'
      ? 8
      : aspectRatio() === 'square'
        ? 10
        : 12; // landscape

  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <LayoutWidth width={maxColumns}>
        <CaptionedImage {...transformedSlice.value} />
      </LayoutWidth>
    </SpacingComponent>
  );
};

export default EditorialImageSlice;
