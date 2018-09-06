import { storiesOf } from '@storybook/react';
import InfoBox from '../../../common/views/components/InfoBox/InfoBox';
import { boolean, text } from '@storybook/addon-knobs/react';
import Readme from '../../../common/views/components/InfoBox/README.md';
import {font} from '../../../common/utils/classnames';

const InfoBoxExample = () => {
  const title = text('Title', 'Visit us');
  const hasMoreInfoLink = boolean('Has more info. link', true);

  return <InfoBox title={title.length > 0 ? title : null} items={[
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'Free admission',
        spans: []
      }],
      icon: 'ticket'
    },
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'Gallery 1, Level 0',
        spans: []
      }],
      icon: 'location'
    },
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'Step-free access is available to all floors of the building',
        spans: []
      }],
      icon: 'a11y'
    },
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'Large print guides, transscripts and magnifiers are available in the gallery',
        spans: []
      }],
      icon: 'a11yVisual'
    },
    {
      title: null,
      description: [{
        type: 'paragraph',
        text: 'A family activity pack is available in the gallery',
        spans: []
      }],
      icon: 'information'
    },
    {
      title: 'Location',
      description: [{
        type: 'paragraph',
        text: 'We’ll be in the Conservation Studio. To get there, go to the Information Point and you’ll be escorted up and through the staff doors to this behind-the-scenes space.',
        spans: []
      }]
    },
    {
      title: 'First come, first served',
      description: [{
        type: 'paragraph',
        text: 'Booking a ticket for a free event does not guarantee a place on the day. Doors usually open 15 minutes before an event starts. We advise arriving ten minutes before the event is scheduled to start.',
        spans: []
      }]
    },
    {
      title: 'British Sign Language',
      description: [{
        type: 'paragraph',
        text: 'This event will have British Sign Language interpretation. If you would like to come along, email us at access@wellcomecollection.org or call 020 7611 2222.',
        spans: []
      }],
      icon: 'britishSignLanguage'
    }
  ]
  }>
    {hasMoreInfoLink && <p className={`plain-text no-margin ${font({s: 'HNL4'})}`}>
      <a href='/access'>More information link</a>
    </p>}
  </InfoBox>;
};

const stories = storiesOf('Components', module);
stories
  .add('Info box', InfoBoxExample, {info: Readme});
