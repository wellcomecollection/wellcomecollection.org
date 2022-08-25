import { multiLineText, singleLineText } from './structured-text';
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
import booleanDeprecated from './boolean-deprecated';

// I've left slice here as we shouldn't really use it.
type SliceProps = {
  nonRepeat?: Record<string, unknown>;
  repeat?: Record<string, unknown>;
};

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
          text: multiLineText({
            label: 'Text',
            extraTextOptions: ['heading2', 'heading3', 'list-item'],
          }),
        },
      }),
      // These should probably be called captionedImage etc, but legacy says no
      editorialImage: captionedImageSlice(),
      editorialImageGallery: captionedImageGallerySlice(),
      gifVideo: gifVideoSlice(),
      iframe: iframeSlice(),
      quote: slice('Quote', {
        nonRepeat: {
          text: multiLineText({ label: 'Quote' }),
          citation: singleLineText({ label: 'Citation' }),
        },
      }),
      standfirst: slice('Standfirst', {
        nonRepeat: {
          text: singleLineText({ label: 'Standfirst' }),
        },
      }),
      table: table(),
      embed: slice('Embed', {
        nonRepeat: {
          embed: embed('Embed (Youtube, Vimeo etc)'),
          caption: singleLineText({ label: 'Caption' }),
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
      discussion: slice('Discussion', {
        nonRepeat: {
          title: heading({ label: 'Title', level: 2 }),
          text: multiLineText({ label: 'Text' }),
        },
      }),
      tagList: slice('Tag List', {
        nonRepeat: {
          title: heading({ label: 'Title', level: 2 }),
        },
        repeat: {
          link: link('Link', 'web'),
          linkText: text('Link text'),
        },
      }),
      infoBlock: slice('Info block', {
        nonRepeat: {
          title: heading({ label: 'Title', level: 2 }),
          text: multiLineText({
            label: 'Text',
            extraTextOptions: ['heading3', 'list-item'],
          }),
          link: link('Button link', 'web'),
          linkText: text('Button text'),
        },
      }),
      titledTextList: slice('Titled text list', {
        repeat: {
          title: heading({ label: 'Title', level: 3 }),
          text: multiLineText({
            label: 'Text',
            extraTextOptions: ['heading4', 'list-item'],
          }),
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
            'landing-pages',
            'guides',
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
      audioPlayer: slice('Audio Player', {
        nonRepeat: {
          title,
          audio: link('Audio', 'media', []),
        },
      }),
    },
  },
};
