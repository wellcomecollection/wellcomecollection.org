import { multiLineText } from './text';
import { slice } from './body';

export const textAndIconsSlice = () => {
  return slice('Text and icons', {
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
  });
};
