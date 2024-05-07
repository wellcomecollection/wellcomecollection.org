import { mockImage } from './compact-card';

export const mockData = {
  title: 'Title',
  text: [
    {
      type: 'paragraph',
      text: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry.',
      spans: [
        {
          start: 53,
          end: 64,
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
