import { multiLineText, singleLineText } from '../text';
import captionedImageSlice from '../captioned-image-slice';
import captionedImageGallerySlice from '../captioned-image-gallery-slice';
import gifVideoSlice from '../gif-video-slice';
import iframeSlice from '../iframe-slice';
import title from '../title';
import link, { documentLink, webLink } from '../link';
import text from '../keyword';
import heading from '../heading';
import booleanDeprecated from '../boolean-deprecated';
import { embedSlice } from '../embed';
import { textAndIconsSlice } from '../text-and-icons';
import { audioPlayerSlice } from '../audio-player';

// I've left slice here as we shouldn't really use it.
type SliceProps = {
  nonRepeat?: Record<string, unknown>;
  repeat?: Record<string, unknown>;
  description?: string;
};

export function slice(
  label: string,
  { nonRepeat, repeat, description }: SliceProps
) {
  return {
    type: 'Slice',
    fieldset: label,
    description,
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
      embed: embedSlice(),
      audioPlayer: audioPlayerSlice(),
      collectionVenue: slice("Collection venue's hours", {
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
        },
      }),
      titledTextList: slice('Descriptive links list', {
        repeat: {
          title: heading('Title', { level: 3 }),
          text: multiLineText('Text'),
          link: link('Link'),
        },
      }),
      contentList: slice('Content list', {
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
      searchResults: slice('Search results', {
        nonRepeat: {
          title,
          query: text('Query'),
        },
      }),
      textAndIcons: textAndIconsSlice(),
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
    },
  },
};
