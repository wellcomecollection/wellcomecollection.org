import { RichTextField as PrismicRichTextField } from '@prismicio/client';

export const singleLineOfText = () =>
  'Donec non finibus tortor. Nullam scelerisque felis.';

export const prismicRichTextMultiline: PrismicRichTextField = [
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
];

export const text = (): PrismicRichTextField[] =>
  Array(2).fill({
    type: 'paragraph',
    text: 'Sed sit amet finibus velit. Sed ornare eu enim eget varius. Integer molestie ultrices leo non malesuada. Mauris quis dui vitae erat congue maximus. Nullam fringilla at ante vitae convallis.',
    spans: [],
  });

export const smallText = (): PrismicRichTextField => [
  {
    type: 'paragraph',
    text: 'Vestibulum porttitor urna ac molestie imperdiet. Aliquam erat volutpat. Nam nec rhoncus orci. Aliquam quis nulla volutpat, semper nunc eget.',
    spans: [],
  },
];
