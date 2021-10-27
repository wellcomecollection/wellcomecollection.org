import timestamp from './parts/timestamp';
import number from './parts/number';
import select from './parts/select';
import image from './parts/image';
import link from './parts/link';
import structuredText from './parts/structured-text';

const CollectionVenue = {
  Main: {
    title: {
      type: 'Text',
      config: {
        label: 'Title',
      },
    },
    order: number('Order'),
    image: image('Image'),
    link: link('Link', 'web', [], 'Enter url'),
    linkText: structuredText('Linktext', 'single'),
  },
  'Regular opening times': {
    monday: {
      type: 'Group',
      fieldset: "Monday's times",
      config: {
        repeat: false,
        fields: {
          startDateTime: timestamp('Opens'),
          endDateTime: timestamp('Closes'),
        },
      },
    },
    tuesday: {
      type: 'Group',
      fieldset: "Tuesday's times",
      config: {
        repeat: false,
        fields: {
          startDateTime: timestamp('Opens'),
          endDateTime: timestamp('Closes'),
        },
      },
    },
    wednesday: {
      type: 'Group',
      fieldset: "Wednesday's times",
      config: {
        repeat: false,
        fields: {
          startDateTime: timestamp('Opens'),
          endDateTime: timestamp('Closes'),
        },
      },
    },
    thursday: {
      type: 'Group',
      fieldset: "Thursday's times",
      config: {
        repeat: false,
        fields: {
          startDateTime: timestamp('Opens'),
          endDateTime: timestamp('Closes'),
        },
      },
    },
    friday: {
      type: 'Group',
      fieldset: "Friday's times",
      config: {
        repeat: false,
        fields: {
          startDateTime: timestamp('Opens'),
          endDateTime: timestamp('Closes'),
        },
      },
    },
    saturday: {
      type: 'Group',
      fieldset: "Saturday's times",
      config: {
        repeat: false,
        fields: {
          startDateTime: timestamp('Opens'),
          endDateTime: timestamp('Closes'),
        },
      },
    },
    sunday: {
      type: 'Group',
      fieldset: "Sunday's times",
      config: {
        repeat: false,
        fields: {
          startDateTime: timestamp('Opens'),
          endDateTime: timestamp('Closes'),
        },
      },
    },
  },
  'Modified opening times': {
    modifiedDayOpeningTimes: {
      type: 'Group',
      fieldset: 'Modified day opening times',
      config: {
        fields: {
          overrideDate: timestamp('Override date'),
          type: select('Override type', [
            'Bank holiday',
            'Easter',
            'Christmas and New Year',
            'Late Spectacular',
            'other',
          ]),
          startDateTime: timestamp('Opens'),
          endDateTime: timestamp('Closes'),
        },
      },
    },
  },
};

export default CollectionVenue;
