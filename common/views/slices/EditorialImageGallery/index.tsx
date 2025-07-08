import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { EditorialImageGallerySlice as RawEditorialImageGallerySlice } from '@weco/common/prismicio-types';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import {
  defaultContext,
  SliceZoneContext,
} from '@weco/content/views/components/Body';
import ImageGallery from '@weco/content/views/components/ImageGallery';
import { transformEditorialImageGallerySlice } from '@weco/content/services/prismic/transformers/body';

export type EditorialImageGalleryProps = SliceComponentProps<
  RawEditorialImageGallerySlice,
  SliceZoneContext
>;

const EditorialImageGallerySlice: FunctionComponent<
  EditorialImageGalleryProps
> = ({ slice, context }) => {
  const isStandalone = context.contentType === 'standalone-image-gallery';
  const transformedSlice = transformEditorialImageGallerySlice(
    slice,
    isStandalone
  );
  const options = { ...defaultContext, ...context };

  return transformedSlice.value.items?.length ? (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ImageGallery
        {...transformedSlice.value}
        id={slice.id}
        comicPreviousNext={options.comicPreviousNext}
      />
    </SpacingComponent>
  ) : null;
};

export default EditorialImageGallerySlice;
