import { multiLineText, singleLineText } from './text';
import captionedImageSlice from './captioned-image-slice';
import captionedImageGallerySlice from './captioned-image-gallery-slice';
import gifVideoSlice from './gif-video-slice';
import iframeSlice from './iframe-slice';
import table from './table';
import title from './title';
import link, { documentLink, mediaLink, webLink } from './link';
import text from './keyword';
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
          text: multiLineText('Text', {
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
          text: multiLineText('Quote'),
          citation: singleLineText('Citation'),
        },
      }),
      standfirst: slice('Standfirst', {
        nonRepeat: {
          text: singleLineText('Standfirst'),
        },
      }),
      table: table(),
      embed: slice('Embed', {
        nonRepeat: {
          embed: embed('Embed (Youtube, SoundCloud, etc)'),
          caption: singleLineText('Caption'),
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
          content: documentLink('Content item', {
            linkedType: 'collection-venue',
          }),
          showClosingTimes: booleanDeprecated('Show closing times'),
        },
      }),
      contact: slice('Contact', {
        nonRepeat: {
          content: documentLink('Content item', { linkedType: 'teams' }),
        },
      }),
      discussion: slice('Discussion', {
        nonRepeat: {
          title: heading('Title', { level: 2 }),
          text: multiLineText('Text'),
        },
      }),
      tagList: slice('Tag List', {
        nonRepeat: {
          title: heading('Title', { level: 2 }),
        },
        repeat: {
          link: webLink('Link'),
          linkText: text('Link text'),
        },
      }),
      infoBlock: slice('Info block', {
        nonRepeat: {
          title: heading('Title', { level: 2 }),
          text: multiLineText('Text', {
            extraTextOptions: ['heading3', 'list-item'],
          }),
          link: webLink('Button link'),
          linkText: text('Button text'),
        },
      }),
      titledTextList: slice('Titled text list', {
        repeat: {
          title: heading('Title', { level: 3 }),
          text: multiLineText('Text', {
            extraTextOptions: ['heading4', 'list-item'],
          }),
          link: link('Link'),
          label: documentLink('tag', { linkedType: 'labels' }),
        },
      }),
      contentList: slice('(β) Content list', {
        nonRepeat: {
          title,
        },
        repeat: {
          content: documentLink('Content item', {
            linkedTypes: [
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
            ],
          }),
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
          audio: mediaLink('Audio'),
        },
      }),
    },
  },
};
