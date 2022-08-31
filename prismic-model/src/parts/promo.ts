import image from './image';
import { singleLineText } from './structured-text';
import text from './text';

export default {
  type: 'Slices',
  config: {
    label: 'Promo',
    choices: {
      editorialImage: {
        type: 'Slice',
        fieldset: 'Editorial image',
        config: {
          label: 'Editorial image',
        },
        'non-repeat': {
          caption: singleLineText({
            overrideTextOptions: ['paragraph'],
            label: 'Promo text',
          }),
          image: image('Promo image'),
          link: text('Link override'),
        },
      },
    },
  },
};
