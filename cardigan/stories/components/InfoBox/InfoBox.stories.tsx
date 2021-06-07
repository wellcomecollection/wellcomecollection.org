import InfoBox from '@weco/common/views/components/InfoBox/InfoBox';

const Template = args => <InfoBox {...args} />;
export const basic = Template.bind({});
basic.args = {
  title: 'Visit us',
  items: [
    {
      title: null,
      description: [
        {
          type: 'paragraph',
          text: 'Free admission',
          spans: [],
        },
      ],
      icon: 'ticket',
    },
    {
      title: null,
      description: [
        {
          type: 'paragraph',
          text: 'Gallery 1, Level 0',
          spans: [],
        },
      ],
      icon: 'location',
    },
    {
      title: null,
      description: [
        {
          type: 'paragraph',
          text: 'Step-free access is available to all floors of the building',
          spans: [],
        },
      ],
      icon: 'a11y',
    },
    {
      title: null,
      description: [
        {
          type: 'paragraph',
          text:
            'Large print guides, transscripts and magnifiers are available in the gallery',
          spans: [],
        },
      ],
      icon: 'a11yVisual',
    },
    {
      title: null,
      description: [
        {
          type: 'paragraph',
          text: 'A family activity pack is available in the gallery',
          spans: [
            {
              type: 'hyperlink',
              start: 2,
              end: 17,
              data: {
                url: '/',
              },
            },
          ],
        },
      ],
      icon: 'family',
    },
    {
      title: 'Location',
      description: [
        {
          type: 'paragraph',
          text:
            'We’ll be in the Conservation Studio. To get there, go to the Information Point and you’ll be escorted up and through the staff doors to this behind-the-scenes space.',
          spans: [],
        },
      ],
    },
    {
      title: 'First come, first served',
      description: [
        {
          type: 'paragraph',
          text:
            'Booking a ticket for a free event does not guarantee a place on the day. Doors usually open 15 minutes before an event starts. We advise arriving ten minutes before the event is scheduled to start.',
          spans: [],
        },
      ],
    },
    {
      title: 'British Sign Language',
      description: [
        {
          type: 'paragraph',
          text:
            'This event will have British Sign Language interpretation. If you would like to come along, email us at access@wellcomecollection.org or call 020 7611 2222.',
          spans: [],
        },
      ],
      icon: 'britishSignLanguage',
    },
  ],
};
basic.storyName = 'InfoBox';
