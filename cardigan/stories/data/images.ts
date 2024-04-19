import { LicenseType } from '@weco/common/model/license';
import { faker } from '@faker-js/faker';
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
  width = 640,
  height = 360
) => {
  return {
    contentUrl,
    width,
    height,
    alt: 'an image with some alt text',
    tasl: {
      contentUrl,
      title: 'The title of the image',
      author: 'The author',
      sourceName: 'Wellcome Collection',
      sourceLink: 'https://wellcomecollection.org/works',
      license: 'CC-BY-NC' as LicenseType,
    },
  };
};

export const squareImage = (
  contentUrl = readingRoomClockImageUrl,
  width = 300,
  height = 300
) => {
  return {
    contentUrl,
    width,
    height,
    alt: '',
    tasl: {
      contentUrl,
      title: 'The title of the image',
      author: 'The author',
      sourceName: 'Wellcome Collection',
      sourceLink: 'https://wellcomecollection.org/works',
      license: 'CC-BY-NC' as LicenseType,
    },
  };
};

export const captionedImage = () => ({
  image: image(),

  caption: [
    {
      type: 'paragraph',
      text: faker.random.words(10),
      spans: [],
    },
  ],
});

export const imageGallery = () => {
  const items = Array(4).fill(captionedImage());
  return {
    id: '123',
    title: singleLineOfText(),
    items,
  };
};
