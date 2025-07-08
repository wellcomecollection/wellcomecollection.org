import { ComponentProps, FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { getCrop } from '@weco/common/model/image';
import { EditorialImageSlice as RawEditorialImageSlice } from '@weco/common/prismicio-types';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import Tasl from '@weco/common/views/components/Tasl';
import HeightRestrictedPrismicImage from '@weco/content/views/components/HeightRestrictedPrismicImage';
import { transformEditorialImageSlice } from '@weco/content/services/prismic/transformers/body';

type TaslProps = ComponentProps<typeof Tasl>;

const ImageWrapper = styled.div`
  position: relative;
`;

type Props = {
  Image: ReactElement<
    typeof PrismicImage | typeof HeightRestrictedPrismicImage
  >;
  tasl?: TaslProps;
};

const ImageWithTasl: FunctionComponent<Props> = ({ Image, tasl }) => (
  <ImageWrapper>
    {Image}
    {tasl && <Tasl {...tasl} />}
  </ImageWrapper>
);

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
