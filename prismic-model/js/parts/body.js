// @flow
import structuredText from './structured-text';
import captionedImageSlice from './captioned-image-slice';
import captionedImageGallerySlice from './captioned-image-gallery-slice';
import gifVideoSlice from './gif-video-slice';
import iframeSlice from './iframe-slice';
import table from './table';
import title from './title';
import link from './link';
import text from './text';
import embed from './embed';
import mediaObject from './media-object';
import heading from './heading';
import booleanDeprecated from '../parts/boolean-deprecated';

// I've left slice here as we shouldn't really use it.
type SliceProps = {|
  nonRepeat?: { [string]: any },
  repeat?: { [string]: any },
|};

export function slice(label: string, { nonRepeat, repeat }: SliceProps) {
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
        {
          name: 'body',
          display: 'Body',
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
      table: table(),
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
          showClosingTimes: booleanDeprecated('Show closing times'),
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
      discussion: slice('Discussion', {
        nonRepeat: {
          title: heading('Title', 2),
          text: structuredText('Text'),
        },
      }),
      tagList: slice('Tag List', {
        nonRepeat: {
          title: heading('Title', 2),
        },
        repeat: {
          link: link('Link', 'web'),
          linkText: text('Link text'),
        },
      }),
      infoBlock: slice('Info block', {
        nonRepeat: {
          title: heading('Title', 2),
          text: structuredText('Text', 'multi', ['heading3', 'list-item']),
          link: link('Button link', 'web'),
          linkText: text('Button text'),
        },
      }),
      titledTextList: slice('Titled text list', {
        repeat: {
          title: heading('Title', 3),
          text: structuredText('Text', 'multi', ['heading4', 'list-item']),
          link: link('Link'),
          label: link('tag', 'document', ['labels']),
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
            'card',
            'seasons',
          ]),
        },
      }),
      searchResults: slice('(β) Search results', {
        nonRepeat: {
          title,
          query: text('Query'),
        },
      }),
      mediaObjectList: slice('Media Object List', {
        repeat: {
          ...mediaObject,
        },
      }),
    },
  },
};
