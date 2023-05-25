import timestamp from './parts/timestamp';
import number from './parts/number';
import select from './parts/select';
import image from './parts/image';
import { webLink } from './parts/link';
import { singleLineText } from './parts/text';
import { CustomType } from './types/CustomType';

const collectionVenue: CustomType = {
  id: 'collection-venue',
  label: 'Collection venue',
  repeatable: true,
  status: true,
  json: {
    Main: {
      title: {
        type: 'Text',
        config: {
          label: 'Title',
        },
      },
      order: number('Order'),
      image: image('Image'),
      link: webLink('Link', { placeholder: 'Enter url' }),
      linkText: singleLineText('Linktext'),
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
            type: select('Override type', {
              options: [
                'Bank holiday',
                'Easter',
                'Christmas and New Year',
                'Late Spectacular',
                'other',
              ],
            }),
            startDateTime: timestamp('Opens'),
            endDateTime: timestamp('Closes'),
          },
        },
      },
    },
  },
  format: 'custom',
};

export default collectionVenue;
