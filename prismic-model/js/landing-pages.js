// @flow
import { slice } from './parts/body';
import title from './parts/title';
import promo from './parts/promo';
import link from './parts/link';
import timestamp from './parts/timestamp';
import structuredText from './parts/structured-text';
import captionedImageSlice from './parts/captioned-image-slice';
import booleanDeprecated from './parts/boolean-deprecated';

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
              hasFeatured: booleanDeprecated('Feature the first item?'),
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
                'seasons',
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
