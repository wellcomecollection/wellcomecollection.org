import { RichTextField } from '@prismicio/client';
import { Meta, StoryObj } from '@storybook/react';

import { ReadmeDecorator } from '@weco/cardigan/config/decorators';
import { darkCloudImageUrl } from '@weco/cardigan/stories/data/images';
import untransformedbody from '@weco/cardigan/stories/data/untransformed-body';
import EventSchedule from '@weco/common/views/components/EventSchedule';
import Readme from '@weco/common/views/components/EventSchedule/README.mdx';
import { Place } from '@weco/content/types/places';

const schedule = [
  {
    event: {
      untransformedBody: untransformedbody,
      type: 'events' as const,
      id: 'XH6TrhAAAPXyGlz3',
      uid: 'as-far-as-isolation-goes',
      title: 'As Far as Isolation Goes',
      promo: {
        caption:
          'Drop in to experience a newly commissioned work by artists Basel Zaraa and Tania El Khoury about the health experiences of refugees. This  performance will use painting, touch and sound to connect you with the emotional and mental health hardships faced by people in detention centres and will evolve over the weekend.',
        image: {
          contentUrl: darkCloudImageUrl('3200x1800'),
          width: 3200,
          height: 1800,
          alt: 'Photograph of a forearm with fingers outstretched, against a slatted wooden background. Small human figures are draw onto the arm, one is circled.',
          tasl: {
            title: 'As far as isolation goes',
            copyrightHolder: 'Tania El Khoury',
          },
          simpleCrops: {},
          richCrops: {},
        },
      },
      image: {
        contentUrl: darkCloudImageUrl('3200x1800'),
        width: 3484,
        height: 1960,
        alt: 'Photograph of a forearm with fingers outstretched, against a slatted wooden background. Small human figures are draw onto the arm, one is circled.',
        tasl: {
          title: 'As far as isolation goes',
          copyrightHolder: 'Tania El Khoury',
        },
      },
      labels: [
        {
          text: 'Performance',
        },
      ],
      locations: [
        {
          id: 'Wn1gnioAACoAIABr',
          untransformedBody: untransformedbody,
          title: 'Ground floor Atrium',
          level: 0,
          labels: [],
          information: [
            {
              type: 'paragraph',
              text: 'We’ll be in the Atrium, which is just inside the entrance to Wellcome Collection on level 0.',
              spans: [],
            },
          ],
        } as Place,
      ],
      audiences: [],
      format: {
        id: 'Wn3Q3SoAACsAIeFI',
        title: 'Performance',
        description:
          '<p>An event where someone will put on a show for you to watch.</p>',
      },
      interpretations: [],
      policies: [
        {
          id: 'W3RJeikAACIAF2Mw',
          title: 'Drop in',
          description: [
            {
              type: 'paragraph',
              text: "Just turn up to this event. It's likely to have room for everyone. If you have any access questions, requests or requirements, you can email us at access@wellcomecollection.org or call 020 7611 2222.",
              spans: [
                {
                  start: 147,
                  end: 176,
                  type: 'hyperlink',
                  data: {
                    link_type: 'Web',
                    url: 'mailto:access@wellcomecollection.org',
                  },
                },
              ],
            },
          ] as RichTextField,
        },
      ],
      hasEarlyRegistration: false,
      series: [],
      seasons: [],
      contributors: [],
      scheduleLength: 0,
      schedule: [],
      isCompletelySoldOut: false,
      onlineSoldOut: false,
      inVenueSoldOut: false,
      times: [
        {
          range: {
            startDateTime: new Date('2019-04-06T11:00:00.000Z'),
            endDateTime: new Date('2019-04-06T13:00:00.000Z'),
          },
          isFullyBooked: {
            inVenue: false,
            online: false,
          },
          onlineIsFullyBooked: null,
        },
        {
          range: {
            startDateTime: new Date('2019-04-06T14:00:00.000Z'),
            endDateTime: new Date('2019-04-06T16:00:00.000Z'),
          },
          isFullyBooked: {
            inVenue: false,
            online: false,
          },
          onlineIsFullyBooked: null,
        },
        {
          range: {
            startDateTime: new Date('2019-04-07T11:00:00.000Z'),
            endDateTime: new Date('2019-04-07T13:00:00.000Z'),
          },
          isFullyBooked: {
            inVenue: false,
            online: false,
          },
          onlineIsFullyBooked: null,
        },
        {
          range: {
            startDateTime: new Date('2019-04-07T14:00:00.000Z'),
            endDateTime: new Date('2019-04-07T16:00:00.000Z'),
          },
          isFullyBooked: {
            inVenue: false,
            online: false,
          },
          onlineIsFullyBooked: null,
        },
      ],
      isPast: true,
      isOnline: false,
      availableOnline: false,
      primaryLabels: [
        {
          text: 'Performance',
        },
      ],
      secondaryLabels: [],
      onlinePolicies: [],
      onlineHasEarlyRegistration: false,
    },
    isNotLinked: false,
  },
];

const meta: Meta<typeof EventSchedule> = {
  title: 'Components/EventSchedule',
  component: EventSchedule,
  args: {
    schedule,
  },
};

export default meta;

type Story = StoryObj<typeof EventSchedule>;

export const Basic: Story = {
  name: 'EventSchedule',
  render: args => (
    <ReadmeDecorator
      WrappedComponent={EventSchedule}
      args={args}
      Readme={Readme}
    />
  ),
};
