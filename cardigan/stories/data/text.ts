import { faker } from '@faker-js/faker';
import { RichTextField as PrismicRichTextField } from '@prismicio/client';

faker.seed(123);

export const singleLineOfText = () => faker.random.words(7);

export const prismicRichTextMultiline = [
  {
    type: 'heading2',
    text: 'In consectetur urna turpis, eu egestas elit ultricies ac. ',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'Sed feugiat diam non mattis dignissim. Morbi vel pharetra dolor. Suspendisse viverra hendrerit leo a viverra. Vestibulum pharetra, tellus eu vestibulum hendrerit, ex justo condimentum nunc, eget varius lectus ante non erat. Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
    spans: [],
  },
  {
    type: 'heading3',
    text: 'Sed feugiat diam non mattis dignissim.',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'In consectetur urna turpis, eu egestas elit ultricies ac. Curabitur a urna velit. Maecenas vel pellentesque risus. Morbi ex sem, vestibulum id accumsan luctus, vehicula quis ipsum. Fusce nec felis mauris. Duis ornare odio interdum, consectetur nisi quis, blandit urna. Vestibulum imperdiet eu neque non tincidunt. Donec facilisis semper pulvinar.',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'Sed feugiat diam non mattis dignissim. Morbi vel pharetra dolor. Suspendisse viverra hendrerit leo a viverra. Vestibulum pharetra, tellus eu vestibulum hendrerit, ex justo condimentum nunc, eget varius lectus ante non erat. Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
    spans: [],
  },
  {
    type: 'paragraph',
    text: 'Sed feugiat diam non mattis dignissim. Morbi vel pharetra dolor. Suspendisse viverra hendrerit leo a viverra. Vestibulum pharetra, tellus eu vestibulum hendrerit, ex justo condimentum nunc, eget varius lectus ante non erat. Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
    spans: [],
  },
] as PrismicRichTextField;

export const text = () =>
  Array(2).fill({
    type: 'paragraph',
    text: `${faker.random.words(30)}`,
    spans: [],
  });

export const smallText = () => [
  {
    type: 'paragraph',
    text: `${faker.random.words(20)}`,
    spans: [],
  },
];
