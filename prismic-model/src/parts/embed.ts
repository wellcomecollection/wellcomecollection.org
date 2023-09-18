import { multiLineText, singleLineText } from './text';

export default (label: string) => ({
  type: 'Embed',
  config: {
    label,
  },
});

type EmbedSliceProps = {
  overrideTextOptions?: string[];
};

export const embedSlice = (props?: EmbedSliceProps) => {
  return {
    type: 'Slice',
    description: 'Youtube, SoundCloud, etc.',
    fieldset: 'Embed',
    'non-repeat': {
      embed: {
        type: 'Embed',
        fieldset: 'Embed',
      },
      caption: singleLineText('Caption', {
        overrideTextOptions: props?.overrideTextOptions || [
          'paragraph',
          'hyperlink',
          'strong',
          'em',
        ],
      }),
      collapsibleContent: multiLineText('Collapsible content', {
        overrideTextOptions: ['heading2', 'heading3', 'paragraph', 'strong'],
      }),
    },
  };
};
