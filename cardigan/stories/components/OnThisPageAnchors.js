import { storiesOf } from '@storybook/react';
import OnThisPageAnchors from '../../../common/views/components/OnThisPageAnchors/OnThisPageAnchors';
import Readme from '../../../common/views/components/OnThisPageAnchors/README.md';

const OnThisPageAnchorsExample = () => {
  return (
    <OnThisPageAnchors
      links={[
        { text: 'Getting here', url: '#getting-here' },
        {
          text: 'Getting around the building',
          url: '#getting-around-the-building',
        },
        {
          text: 'Accessible exhibitions and events',
          url: '#accessible-exhibitions-and-events',
        },
        {
          text: 'Visual access',
          url: '#visual-access',
        },
        {
          text: 'Auditory access',
          url: '#auditory-access',
        },
        {
          text: 'Wheelchair and physical access',
          url: '#wheelchair-and-physical-access',
        },
        {
          text: 'Sensory access',
          url: '#sensory-access',
        },
      ]}
    />
  );
};

const stories = storiesOf('Components', module);
stories.add('OnThisPageAnchors', OnThisPageAnchorsExample, {
  readme: { sidebar: Readme },
});
