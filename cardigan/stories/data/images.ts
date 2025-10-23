import { ImageType } from '@weco/common/model/image';
import { LicenseType } from '@weco/common/model/license';
import { Picture } from '@weco/common/model/picture';
import { ContentApiImage } from '@weco/content/services/wellcome/content/types/api';
import { CaptionedImageProps } from '@weco/content/views/components/CaptionedImage';
import { Props as ImageGalleryProps } from '@weco/content/views/components/ImageGallery';

import { singleLineOfText } from './text';

type ImageSize = '1600x900' | '3200x1500' | '3200x1800' | '3200x3200';

export const imagesBaseUrl = `${window.location.origin}/images`;

export const florenceWinterfloodImageUrl = (size: ImageSize) =>
  `${imagesBaseUrl}/florence-winterflood-${size}.jpg`;
export const darkCloudImageUrl = (size: ImageSize) =>
  `${imagesBaseUrl}/darkcloud-promo-${size}.png`;
export const bookImageUrl = `${imagesBaseUrl}/book.png`;
export const readingRoomImageUrl = `${imagesBaseUrl}/reading-room-3200x1800.jpg`;
export const readingRoomClockImageUrl = `${imagesBaseUrl}/reading-room-clock-3200x3200.jpg`;

export const image = (
  contentUrl = readingRoomImageUrl,
  width = 472,
  height = 726,
  extraProps = {}
): Picture => ({
  contentUrl,
  width,
  height,
  alt: 'an image with some alt text',
  tasl: {
    title: 'The title of the image',
    author: 'The author',
    sourceName: 'Wellcome Collection',
    sourceLink: 'https://wellcomecollection.org/works/gqhkfsft',
    license: 'CC-BY-NC' as LicenseType,
  },
  ...extraProps,
});

export const squareImage = (
  contentUrl = readingRoomClockImageUrl,
  width = 300,
  height = 300
): ImageType => ({
  contentUrl,
  width,
  height,
  alt: '',
  tasl: {
    title: 'The title of the image',
    author: 'The author',
    sourceName: 'Wellcome Collection',
    sourceLink: 'https://wellcomecollection.org/works/gqhkfsft',
    license: 'CC-BY-NC' as LicenseType,
  },
});

export const captionedImage = (extraProps?: string): CaptionedImageProps => ({
  image: image(extraProps),
  caption: [
    {
      type: 'paragraph',
      text: 'Etiam pellentesque dui tellus, quis dictum turpis blandit id. Etiam.',
      spans: [
        {
          start: 19,
          end: 29,
          type: 'hyperlink',
          data: {
            link_type: 'Web',
            url: 'https://wellcomecollection.org/works/gqhkfsft',
            target: '_blank',
          },
        },
      ],
    },
  ],
  hasRoundedCorners: false,
});

export const imageGallery = (): ImageGalleryProps & { id: number } => {
  const items = Array(4).fill(captionedImage());

  return {
    id: 123,
    title: singleLineOfText(),
    items,
    isStandalone: false,
    isFrames: false,
  };
};

export const imageWithCrops = {
  contentUrl: florenceWinterfloodImageUrl('1600x900'),
  width: 1600,
  height: 900,
  alt: 'An artwork featuring a large painted human hand, surrounded by fragments of maps.',
  tasl: {
    title: "Alzheimer's disease",
    author: 'Florence Winterflood',
    sourceName: 'Wellcome Collection',
    sourceLink: 'CC-BY-NC',
    license: undefined,
    copyrightHolder: undefined,
    copyrightLink: undefined,
  },
  simpleCrops: {
    '32:15': {
      contentUrl: florenceWinterfloodImageUrl('3200x1500'),
      width: 3200,
      height: 1500,
    },
    '16:9': {
      contentUrl: florenceWinterfloodImageUrl('3200x1800'),
      width: 3200,
      height: 1800,
    },
    square: {
      contentUrl: florenceWinterfloodImageUrl('3200x3200'),
      width: 3200,
      height: 3200,
    },
  },
};

export const contentAPIImage: ContentApiImage = {
  type: 'PrismicImage',
  dimensions: {
    width: 3543,
    height: 1993,
  },
  alt: 'A collage combining photos and illustration featuring a woman in a blue hairnet.',
  copyright:
    'The personal cost of mental illness | Tanya Cooper for Wellcome Collection | | | CC-BY-NC-ND | |',
  url: 'https://images.prismic.io/wellcomecollection/Z1BdtpbqstJ98BwR_WellcomeCollection_Main.jpg?auto=format,compress',
  id: 'Z1BdtpbqstJ98BwR',
  edit: {
    x: 0,
    y: 0,
    zoom: 1,
    background: 'transparent',
  },
  '32:15': {
    dimensions: {
      width: 3200,
      height: 1500,
    },
    alt: 'A collage combining photos and illustration featuring a woman in a blue hairnet.',
    copyright:
      'The personal cost of mental illness | Tanya Cooper for Wellcome Collection | | | CC-BY-NC-ND | |',
    url: florenceWinterfloodImageUrl('3200x1500'),
    id: 'Z1BdtpbqstJ98BwR',
    edit: {
      x: 0,
      y: 166,
      zoom: 1,
      background: 'transparent',
    },
  },
  '16:9': {
    dimensions: {
      width: 3200,
      height: 1800,
    },
    alt: 'A collage combining photos and illustration featuring a woman in a blue hairnet.',
    copyright:
      'The personal cost of mental illness | Tanya Cooper for Wellcome Collection | | | CC-BY-NC-ND | |',
    url: florenceWinterfloodImageUrl('3200x1800'),
    id: 'Z1BdtpbqstJ98BwR',
    edit: {
      x: 0,
      y: 0,
      zoom: 1,
      background: 'transparent',
    },
  },
  square: {
    dimensions: {
      width: 3200,
      height: 3200,
    },
    alt: 'A collage combining photos and illustration featuring a woman in a blue hairnet.',
    copyright:
      'The personal cost of mental illness | Tanya Cooper for Wellcome Collection | | | CC-BY-NC-ND | |',
    url: florenceWinterfloodImageUrl('3200x3200'),
    id: 'Z1BdtpbqstJ98BwR',
    edit: {
      x: 775,
      y: 0,
      zoom: 1,
      background: 'transparent',
    },
  },
};
