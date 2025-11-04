import { FunctionComponent } from 'react';
import { useTheme } from 'styled-components';

import { getCrop } from '@weco/common/model/image';
import { FeaturedMedia } from '@weco/common/views/components/PageHeader';
import Picture from '@weco/common/views/components/Picture';
import PrismicImage from '@weco/common/views/components/PrismicImage';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import { isVideoEmbed } from '@weco/content/types/body';
import { GenericContentFields } from '@weco/content/types/generic-content-fields';
import ImageWithTasl from '@weco/content/views/components/ImageWithTasl';

export function getFeaturedMedia(
  fields: GenericContentFields
): FeaturedMedia | undefined {
  const image = fields.promo && fields.promo.image;
  const widescreenImage = getCrop(fields.image, '16:9');
  const { untransformedBody } = fields;

  const featuredVideo =
    untransformedBody.length > 0 && isVideoEmbed(untransformedBody[0])
      ? untransformedBody[0]
      : undefined;
  const transformedFeaturedVideoSlice =
    featuredVideo && transformEmbedSlice(featuredVideo);

  const featuredMedia = transformedFeaturedVideoSlice ? (
    <VideoEmbed {...transformedFeaturedVideoSlice?.value} />
  ) : widescreenImage ? (
    <ImageWithTasl
      Image={
        <PrismicImage
          image={widescreenImage}
          sizes={{
            xlarge: 1,
            large: 1,
            medium: 1,
            small: 1,
          }}
          quality="low"
        />
      }
      tasl={widescreenImage.tasl}
    />
  ) : image ? (
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
      tasl={image.tasl}
    />
  ) : undefined;
  return featuredMedia;
}

export const HeroPicture: FunctionComponent<{
  fields: GenericContentFields;
}> = ({ fields }) => {
  const theme = useTheme();
  const squareImage = getCrop(fields.image, 'square');
  const widescreenImage = getCrop(fields.image, '16:9');

  if (!squareImage || !widescreenImage) {
    return null;
  }

  return (
    <Picture
      images={[
        { ...widescreenImage, minWidth: `${theme.sizes.medium}px` },
        squareImage,
      ]}
      isFull={true}
    />
  );
};
