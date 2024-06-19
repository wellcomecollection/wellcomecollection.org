import { ReactElement } from 'react';
import { getCrop } from '@weco/common/model/image';
import { breakpoints } from '@weco/content/utils/breakpoints';
import ImageWithTasl from '../components/ImageWithTasl/ImageWithTasl';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { FeaturedMedia } from '@weco/common/views/components/PageHeader/PageHeader';
import Picture from '@weco/common/views/components/Picture/Picture';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { isVideoEmbed } from '@weco/content/types/body';
import { GenericContentFields } from '../types/generic-content-fields';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';

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

export function getHeroPicture(
  fields: GenericContentFields
): ReactElement<typeof Picture> | undefined {
  const squareImage = getCrop(fields.image, 'square');
  const widescreenImage = getCrop(fields.image, '16:9');

  return (
    squareImage &&
    widescreenImage && (
      <Picture
        images={[
          { ...widescreenImage, minWidth: breakpoints.medium },
          squareImage,
        ]}
        isFull={true}
      />
    )
  );
}
