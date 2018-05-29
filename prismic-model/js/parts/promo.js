// @flow
import image from './image';
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
          label: 'Editorial image'
        },
        'non-repeat': {
          caption: {
            type: 'StructuredText',
            config: {
              label: 'Promo text',
              single: 'paragraph'
            }
          },
          image: image('Promo image'),
          link: text('Link override')
        }
      }
    }
  }
};
