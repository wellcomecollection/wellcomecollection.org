import { storiesOf } from '@storybook/react';
import Discussion from '../../../common/views/components/Discussion/Discussion';
import Readme from '../../../common/views/components/BetaMessage/README.md';
import { person } from '../content';

const stories = storiesOf('Components', module);
const discussion = [
  {
    contributor: person(),
    text: [
      {
        type: 'paragraph',
        text:
          'In consectetur urna turpis, eu egestas elit ultricies ac. Curabitur a urna velit. Maecenas vel pellentesque risus. Morbi ex sem, vestibulum id accumsan luctus, vehicula quis ipsum. Fusce nec felis mauris. Duis ornare odio interdum, consectetur nisi quis, blandit urna. Vestibulum imperdiet eu neque non tincidunt. Donec facilisis semper pulvinar.',
        spans: [],
      },
      {
        type: 'paragraph',
        text:
          'Sed feugiat diam non mattis dignissim. Morbi vel pharetra dolor. Suspendisse viverra hendrerit leo a viverra. Vestibulum pharetra, tellus eu vestibulum hendrerit, ex justo condimentum nunc, eget varius lectus ante non erat. Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
        spans: [],
      },
    ],
  },
  {
    contributor: person(),
    text: [
      {
        type: 'paragraph',
        text:
          'Fusce nec felis mauris. Duis ornare odio interdum, consectetur nisi quis, blandit urna. Vestibulum imperdiet eu neque non tincidunt. Donec facilisis semper pulvinar.',
        spans: [],
      },
      {
        type: 'paragraph',
        text: 'Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
        spans: [],
      },
    ],
  },
  {
    contributor: person(),
    text: [
      {
        type: 'paragraph',
        text:
          'Curabitur a urna velit. Maecenas vel pellentesque risus. Morbi ex sem, vestibulum id accumsan luctus, vehicula quis ipsum. Fusce nec felis mauris. Duis ornare odio interdum, consectetur nisi quis, blandit urna. Vestibulum imperdiet eu neque non tincidunt. Donec facilisis semper pulvinar.',
        spans: [],
      },
      {
        type: 'paragraph',
        text:
          'Sed feugiat diam non mattis dignissim. Morbi vel pharetra dolor. Etiam ac erat interdum, ultricies purus ac, malesuada nisi.',
        spans: [],
      },
    ],
  },
];

stories.add('Discussion', () => <Discussion discussion={discussion} />, {
  readme: { sidebar: Readme },
});
