import { breakpoints } from '@weco/common/utils/breakpoints';
import { UiImage } from '@weco/common/views/components/Images/Images';
import Picture from '@weco/common/views/components/Picture/Picture';
import VideoEmbed from '../components/VideoEmbed/VideoEmbed';
import { ReactElement } from 'react';
import { GenericContentFields } from '../types/generic-content-fields';

export type FeaturedMedia =
  | ReactElement<typeof UiImage>
  | typeof VideoEmbed
  | typeof Picture;

export function getFeaturedMedia(
  fields: GenericContentFields,
  isPicture?: boolean
): FeaturedMedia | undefined {
  const image = fields.promo && fields.promo.image;
  const { squareImage, widescreenImage } = fields;
  const { body } = fields;

  const hasFeaturedVideo = body.length > 0 && body[0].type === 'videoEmbed';

  const featuredMedia = hasFeaturedVideo ? (
    <VideoEmbed {...body[0].value} />
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
    <UiImage {...image} crops={{}} sizesQueries="" />
  ) : undefined;

  return featuredMedia;
}

export function getHeroPicture(
  fields: GenericContentFields
): ReactElement<typeof Picture> | undefined {
  const { squareImage, widescreenImage } = fields;

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
