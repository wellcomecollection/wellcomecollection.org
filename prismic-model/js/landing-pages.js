// @flow
import title from './parts/title';
import promo from './parts/promo';
import link from './parts/link';
import timestamp from './parts/timestamp';
import structuredText from './parts/structured-text';
import captionedImageSlice from './parts/captioned-image-slice';

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

const LandingPage = {
  Page: {
    title,
    datePublished: timestamp('Date published'),
    body: {
      fieldset: 'Body content',
      type: 'Slices',
      config: {
        choices: {
          editorialImage: captionedImageSlice(),
          standfirst: slice('Standfirst', {
            nonRepeat: {
              text: structuredText('Standfirst', 'single'),
            },
          }),
          contentList: slice('Content list', {
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
                'landing-pages',
              ]),
            },
          }),
        },
      },
    },
  },
  Promo: {
    promo,
  },
  Metadata: {
    metadataDescription: structuredText('Metadata description', 'single'),
  },
};

export default LandingPage;
