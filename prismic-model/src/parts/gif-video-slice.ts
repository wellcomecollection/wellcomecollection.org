import { singleLineText } from './text';
import keyword from './keyword';
import { mediaLink } from './link';
import select from './select';
import boolean from './boolean';

export default function () {
  return {
    type: 'Slice',
    fieldset: 'Gif video',
    'non-repeat': {
      caption: singleLineText('Caption'),
      tasl: keyword('TASL', {
        placeholder:
          'title|author|sourceName|sourceLink|license|copyrightHolder|copyrightLink',
      }),
      video: mediaLink('Video', { placeholder: 'Video' }),
      playbackRate: select('Playback rate', {
        options: [
          '0.1',
          '0.25',
          '0.5',
          '0.75',
          '1',
          '1.25',
          '1.5',
          '1.75',
          '2',
        ],
      }),
      autoPlay: boolean('Auto play', { defaultValue: true }),
      loop: boolean('Loop video', { defaultValue: true }),
      mute: boolean('Mute video', { defaultValue: true }),
      showControls: boolean('Show controls', { defaultValue: false }),
    },
  };
}
