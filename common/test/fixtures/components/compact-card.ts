import { ImageType } from '@weco/common/model/image';

export const mockImage: ImageType = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/f16b826e-9f68-4cda-ac26-641098fe8081_WELL-10129+Mary+Lowndes.jpg',
  width: 545,
  height: 805,
  tasl: {
    title: 'title',
    author: 'author',
    sourceLink: 'sourceLink',
    sourceName: 'sourceName',
    copyrightHolder: 'copyrightHolder',
    copyrightLink: 'copyrightLink',
    license: 'CC-0',
  },
  alt: 'A sketch depicting a Lady Justice in a red robe with a sword by Mary Lowndes',
};

export const mockData = {
  title: 'mock title',
  text: 'some text',
  image: mockImage,
};

export const mockDataWithPrismicText = {
  title: 'mock title',
  text: [
    {
      type: 'paragraph',
      text: 'Keep your nose and mouth covered, unless you’re exempt.',
      spans: [
        {
          start: 48,
          end: 54,
          type: 'hyperlink',
          data: {
            link_type: 'Web',
            url: 'https://www.gov.uk/government/publications/face-coverings-when-to-wear-one-and-how-to-make-your-own#when-you-do-not-need-to-wear-a-face-covering',
          },
        },
      ],
    },
  ],
  image: mockImage,
};
