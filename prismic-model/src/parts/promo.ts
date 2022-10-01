import image from './image';
import { singleLineText } from './text';
import text from './keyword';

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
          caption: singleLineText('Promo text', {
            overrideTextOptions: ['paragraph'],
          }),
          image: image('Promo image'),
          link: text('Link override'),
        },
      },
    },
  },
};
