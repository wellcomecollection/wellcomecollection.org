import { ComponentProps, FunctionComponent, ReactElement } from 'react';

import { getCrop } from '@weco/common/model/image';
import { EditorialImageSlice as RawEditorialImageSlice } from '@weco/common/prismicio-types';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Tasl from '@weco/common/views/components/Tasl';
import { transformEditorialImageSlice } from '@weco/content/services/prismic/transformers/body';
import HeightRestrictedPrismicImage from '@weco/content/views/components/HeightRestrictedPrismicImage';

import WorkLinkComponent, { hasLinkedWork } from './ImageWithTasl.WorkLink';

type ImageWithTaslProps = {
  Image: ReactElement<
    typeof PrismicImage | typeof HeightRestrictedPrismicImage
  >;
  tasl?: ComponentProps<typeof Tasl>;
};
const ImageWithTasl: FunctionComponent<ImageWithTaslProps> = ({
  Image,
  tasl,
}) => {
  return (
    <>
      <div style={{ position: 'relative' }}>
        {Image}
        {tasl && <Tasl {...tasl} />}
      </div>

      {tasl && hasLinkedWork(tasl.sourceLink) && (
        <WorkLinkComponent taslSourceLink={tasl.sourceLink} />
      )}
    </>
  );
};

export function getFeaturedPictureWithTasl(
  editorialImage: RawEditorialImageSlice
) {
  const featuredPicture = transformEditorialImageSlice(editorialImage);
  const image =
    getCrop(featuredPicture.value.image, '16:9') || featuredPicture.value.image;

  return (
    <ImageWithTasl
      Image={
        <PrismicImage
          image={image}
          sizes={{
            xlarge: 1,
            large: 1,
            medium: 1,
            small: 1,
          }}
          quality="low"
        />
      }
      tasl={image?.tasl}
    />
  );
}

export default ImageWithTasl;
export { hasLinkedWork };
