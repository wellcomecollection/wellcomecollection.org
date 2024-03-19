import { multiLineText } from './text';
import { slice } from './bodies/body';

export const textAndIconsSlice = () => {
  return slice('Text and icons', {
    description: 'Side-by-side',
    nonRepeat: {
      text: multiLineText('Text', {
        extraTextOptions: ['heading3', 'list-item'],
      }),
    },
    repeat: {
      icon: {
        type: 'Image',
        config: {
          label: 'Icon (will display at 100px wide)',
        },
      },
    },
  });
};
