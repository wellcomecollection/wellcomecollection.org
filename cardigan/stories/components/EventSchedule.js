import { storiesOf } from '@storybook/react';
import EventSchedule from '../../../common/views/components/EventSchedule/EventSchedule';
import readme from '../../../common/views/components/EventSchedule/README.md';
import moment from 'moment';

const stories = storiesOf('Components', module);

const schedule = [
  {
    event: {
      type: 'events',
      id: 'XH6TrhAAAPXyGlz3',
      title: 'As Far as Isolation Goes',
      promoText:
        'Drop in to experience a newly commissioned work by artists Basel Zaraa and Tania El Khoury about the health experiences of refugees. This  performance will use painting, touch and sound to connect you with the emotional and mental health hardships faced by people in detention centres and will evolve over the weekend.',
      promoImage: {
        contentUrl:
          'https://wellcomecollection.cdn.prismic.io/wellcomecollection/f36afe6d86bb41f157d41e603187e1f53eb93d8d_tania-and-basel.jpg',
        width: 3200,
        height: 1800,
        alt:
          'Photograph of a forearm with fingers outstretched, against a slatted wooden background. Small human figures are draw onto the arm, one is circled.',
        crops: {},
      },
      labels: [
        {
          url: null,
          text: 'Performance',
        },
      ],
      place: {
        id: 'Wn1gnioAACoAIABr',
        title: 'The Atrium',
      },
      format: {
        id: 'Wn3Q3SoAACsAIeFI',
        title: 'Performance',
        description: null,
      },
      times: [
        {
          range: {
            startDateTime: moment('2019-04-06T11:00:00.000Z'),
            endDateTime: moment('2019-04-06T13:00:00.000Z'),
          },
          isFullyBooked: false,
        },
        {
          range: {
            startDateTime: moment('2019-04-06T14:00:00.000Z'),
            endDateTime: moment('2019-04-06T16:00:00.000Z'),
          },
          isFullyBooked: false,
        },
        {
          range: {
            startDateTime: moment('2019-04-07T11:00:00.000Z'),
            endDateTime: moment('2019-04-07T13:00:00.000Z'),
          },
          isFullyBooked: false,
        },
        {
          range: {
            startDateTime: moment('2019-04-07T14:00:00.000Z'),
            endDateTime: moment('2019-04-07T16:00:00.000Z'),
          },
          isFullyBooked: false,
        },
      ],
      displayStart: moment('2019-04-06T11:00:00.000Z'),
      displayEnd: moment('2019-04-06T13:00:00.000Z'),
      dateRange: {
        firstDate: moment('2019-04-06T11:00:00.000Z'),
        lastDate: moment('2019-04-07T16:00:00.000Z'),
        repeats: 4,
      },
      isPast: true,
      isRelaxedPerformance: false,
    },
    isNotLinked: false,
  },
];

const EventScheduleExample = () => (
  <ul className="plain-list no-margin no-padding">
    <EventSchedule schedule={schedule} />
  </ul>
);

stories.add('EventSchedule', EventScheduleExample, { info: readme });
