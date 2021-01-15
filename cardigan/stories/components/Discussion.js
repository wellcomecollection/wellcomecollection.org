import { storiesOf } from '@storybook/react';
import Discussion from '../../../common/views/components/Discussion/Discussion';
import Readme from '../../../common/views/components/BetaMessage/README.md';

const stories = storiesOf('Components', module);
// [{"type":"paragraph","text":"this is some test text","spans":[{"start":8,"end":12,"type":"strong"}]}]
// this is some test text
const discussion = [
  {
    speaker: 'Speaker one',
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
    speaker: 'Speaker two',
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
    speaker: 'Speaker one',
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
