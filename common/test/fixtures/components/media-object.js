import { mockImage } from './compact-card';

export const mockData = {
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
            url:
              'https://www.gov.uk/government/publications/face-coverings-when-to-wear-one-and-how-to-make-your-own#when-you-do-not-need-to-wear-a-face-covering',
          },
        },
      ],
    },
  ],
  image: mockImage,
};
