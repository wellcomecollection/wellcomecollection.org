import title from './parts/title';
import { multiLineText, singleLineText } from './parts/text';
import { CustomType } from './types/CustomType';

const interpretationTypes: CustomType = {
  id: 'interpretation-types',
  label: 'Interpretation type',
  repeatable: true,
  status: true,
  json: {
    'Interpretation type': {
      title,
      // TODO: This should be a Key text field
      // see: https://prismic.io/docs/core-concepts/key-text
      abbreviation: singleLineText('Abbreviation', {
        overrideTextOptions: ['paragraph'],
      }),
      description: multiLineText('Message'),
      primaryDescription: multiLineText('Message if primary interpretation'),
    },
  },
  format: 'custom',
};

export default interpretationTypes;
