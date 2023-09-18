import { multiLineText } from './text';
import { slice } from './bodies/body';
import title from './title';
import { mediaLink } from './link';

export const audioPlayerSlice = () => {
  return slice('Audio Player', {
    nonRepeat: {
      title,
      audio: mediaLink('Audio'),
      collapsibleContent: multiLineText('Collapsible content', {
        overrideTextOptions: ['heading2', 'heading3', 'paragraph', 'strong'],
      }),
    },
  });
};
