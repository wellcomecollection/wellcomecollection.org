// @flow
import structuredText from './structured-text';
import captionedImageSlice from './captioned-image-slice';
import captionedImageGallerySlice from './captioned-image-gallery-slice';
import title from './title';
import link from './link';
import number from './number';
import text from './text';

// I've left slice here as we shouldn't really use it.
type SliceProps = {|
  nonRepeat?: {[string]: any},
  repeat?: {[string]: any}
|}

function slice(
  label: string,
  { nonRepeat, repeat }: SliceProps
) {
  return {
    type: 'Slice',
    fieldset: label,
    'non-repeat': nonRepeat,
    repeat
  };
}

export default {
  fieldset: 'Body content',
  type: 'Slices',
  config: {
    labels: {
      editorialImage: [
        {
          name: 'supporting',
          'display': 'Supporting'
        },
        {
          name: 'standalone',
          display: 'Standalone'
        }
      ]
    },
    choices: {
      text: slice('Text', {
        nonRepeat: {
          text: structuredText('Text', 'multi', ['heading2', 'list-item'])
        }
      }),
      // These should probably be called captionedImage etc, but legacy says no
      editorialImage: captionedImageSlice(),
      editorialImageGallery: captionedImageGallerySlice(),
      contentList: slice('Content list', {
        nonRepeat: {
          title,
          requiredCount: number('Total'),
          backfillQuery: text('Backfill query')
        },
        repeat: {
          content: link('Content item', 'document', ['pages'])
        }
      })
    }
  }
};
