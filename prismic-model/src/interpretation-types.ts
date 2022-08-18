import title from './parts/title';
import { multiLineText, singleLineText } from './parts/structured-text';
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
      abbreviation: singleLineText({
        label: 'Abbreviation',
        overrideTextOptions: ['paragraph'],
      }),
      description: multiLineText({ label: 'Message' }),
      primaryDescription: multiLineText({
        label: 'Message if primary interpretation',
      }),
    },
  },
};

export default interpretationTypes;
