import body, { slice } from './body';
import boolean from './boolean';
import { documentLink } from './link';
import { multiLineText, singleLineText } from './text';

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
      embed: {
        type: 'Slice',
        fieldset: 'Embed',
        'non-repeat': {
          embed: {
            type: 'Embed',
            fieldset: 'Embed',
          },
          caption: singleLineText('Caption', {
            placeholder: 'Caption',
            overrideTextOptions: ['hyperlink', 'em'],
          }),
        },
      },
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
      textAndIcons: slice('Text and icons', {
        description: 'Side-by-side',
        nonRepeat: {
          text: multiLineText('Text', { extraTextOptions: ['heading3'] }),
        },
        repeat: {
          icon: {
            type: 'Image',
            config: {
              label: 'Icon (will display at 100px wide)',
            },
          },
        },
      }),
    },
  },
};
