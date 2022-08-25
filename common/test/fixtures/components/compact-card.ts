import { ImageType } from '../../../model/image';

export const mockImage: ImageType = {
  contentUrl:
    'https://images.prismic.io/wellcomecollection/c8f7b7f4-d455-4c3f-ae65-9dc7428ae60a_EP001430_0001.jpg?auto=compress,format',
  width: 3630,
  height: 2836,
  alt: 'Two St. Bernard dogs with an avalanche victim, one tries to revive him while the other alerts the rescue party.',
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
