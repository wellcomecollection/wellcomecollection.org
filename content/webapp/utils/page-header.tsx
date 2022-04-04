import { getCrop } from '@weco/common/model/image';
import { breakpoints } from '@weco/common/utils/breakpoints';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { FeaturedMedia } from '@weco/common/views/components/PageHeader/PageHeader';
import Picture from '@weco/common/views/components/Picture/Picture';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { ReactElement } from 'react';
import { isVideoEmbed } from 'types/body';
import { GenericContentFields } from '../types/generic-content-fields';

export function getFeaturedMedia(
  fields: GenericContentFields,
  isPicture?: boolean
): FeaturedMedia | undefined {
  const image = fields.promo && fields.promo.image;
  const squareImage = getCrop(fields.image, 'square');
  const widescreenImage = getCrop(fields.image, '16:9');
  const { body } = fields;

  const featuredVideo =
    body.length > 0 && isVideoEmbed(body[0]) ? body[0] : undefined;

  const featuredMedia = featuredVideo ? (
    <VideoEmbed {...featuredVideo.value} />
  ) : isPicture && widescreenImage && squareImage ? (
    <Picture
      images={[
        { ...widescreenImage, minWidth: breakpoints.medium },
        squareImage,
      ]}
      isFull={true}
    />
  ) : widescreenImage ? (
    <UiImage {...widescreenImage} sizesQueries="" />
  ) : image ? (
    <UiImage {...image} sizesQueries="" />
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
