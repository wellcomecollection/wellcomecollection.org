import body, { slice } from './body';
import boolean from '../boolean';
import { embedSlice } from '../embed';
import { documentLink } from '../link';
import { multiLineText, singleLineText } from '../text';
import { textAndIconsSlice } from '../text-and-icons';

export default {
  fieldset: 'Slice zone',
  type: 'Slices',
  config: {
    choices: {
      standfirst: {
        type: 'Slice',
        fieldset: 'Standfirst',
        'non-repeat': {
          text: singleLineText('Standfirst', {
            overrideTextOptions: ['strong', 'em', 'hyperlink'],
          }),
        },
      },
      contact: slice('Contact', {
        nonRepeat: {
          content: documentLink('Content item', { linkedType: 'teams' }),
        },
      }),
      text: {
        type: 'Slice',
        fieldset: 'Text',
        'non-repeat': {
          text: multiLineText('Text', {
            overrideTextOptions: [
              'heading2',
              'heading3',
              'paragraph',
              'strong',
              'em',
              'hyperlink',
              'list-item',
              'embed',
            ],
          }),
        },
      },
      editorialImage: body.config.choices.editorialImage,
      embed: embedSlice({ overrideTextOptions: ['hyperlink', 'em'] }),
      textAndImage: slice('Text and image', {
        description: 'Side-by-side',
        nonRepeat: {
          text: multiLineText('Text', { extraTextOptions: ['heading3'] }),
          image: {
            type: 'Image',
            config: {
              label: 'Image',
            },
          },
          isZoomable: boolean('Allow image to be zoomed to fill viewport?'),
        },
      }),
      textAndIcons: textAndIconsSlice(),
    },
  },
};
