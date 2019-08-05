// @flow
import structuredText from './structured-text';
import captionedImageSlice from './captioned-image-slice';
import captionedImageGallerySlice from './captioned-image-gallery-slice';
import gifVideoSlice from './gif-video-slice';
import iframeSlice from './iframe-slice';
import title from './title';
import link from './link';
import text from './text';
import embed from './embed';
import boolean from '../parts/boolean';

// I've left slice here as we shouldn't really use it.
type SliceProps = {|
  nonRepeat?: { [string]: any },
  repeat?: { [string]: any },
|};

function slice(label: string, { nonRepeat, repeat }: SliceProps) {
  return {
    type: 'Slice',
    fieldset: label,
    'non-repeat': nonRepeat,
    repeat,
  };
}

const featuredLabel = {
  name: 'featured',
  display: 'Featured',
};

export default {
  fieldset: 'Body content',
  type: 'Slices',
  config: {
    labels: {
      collectionVenue: [featuredLabel],
      text: [featuredLabel],
      editorialImage: [
        {
          name: 'supporting',
          display: 'Supporting',
        },
        {
          name: 'standalone',
          display: 'Standalone',
        },
      ],
      quote: [
        {
          name: 'pull',
          display: 'Pull',
        },
        {
          name: 'review',
          display: 'Review',
        },
      ],
    },
    choices: {
      text: slice('Text', {
        nonRepeat: {
          text: structuredText('Text', 'multi', [
            'heading2',
            'heading3',
            'list-item',
          ]),
        },
      }),
      // These should probably be called captionedImage etc, but legacy says no
      editorialImage: captionedImageSlice(),
      editorialImageGallery: captionedImageGallerySlice(),
      gifVideo: gifVideoSlice(),
      iframe: iframeSlice(),
      quote: slice('Quote', {
        nonRepeat: {
          text: structuredText('Quote'),
          citation: structuredText('Citation', 'single'),
        },
      }),
      standfirst: slice('Standfirst', {
        nonRepeat: {
          text: structuredText('Standfirst', 'single'),
        },
      }),
      embed: slice('Embed', {
        nonRepeat: {
          embed: embed('Embed (Youtube, Vimeo etc)'),
          caption: structuredText('Caption', 'single'),
        },
      }),
      map: slice('Map', {
        nonRepeat: {
          title,
          geolocation: {
            type: 'GeoPoint',
            config: {
              label: 'Geo point',
            },
          },
        },
      }),
      collectionVenue: slice('Collection venue', {
        nonRepeat: {
          content: link('Content item', 'document', ['collection-venue']),
          showClosingTimes: boolean('Show closing times'),
        },
      }),
      contact: slice('Contact', {
        nonRepeat: {
          content: link('Content item', 'document', ['teams']),
        },
      }),
      inPageAnchor: slice('In page anchor', {
        nonRepeat: {
          id: {
            type: 'Text',
            config: {
              label: 'id',
              placeholder: 'unique identifier without spaces',
            },
          },
        },
      }),
      contentList: slice('(β) Content list', {
        nonRepeat: {
          title,
        },
        repeat: {
          content: link('Content item', 'document', [
            'pages',
            'event-series',
            'books',
            'events',
            'articles',
            'exhibitions',
          ]),
        },
      }),
      searchResults: slice('(β) Search results', {
        nonRepeat: {
          title,
          query: text('Query'),
        },
      }),
    },
  },
};
