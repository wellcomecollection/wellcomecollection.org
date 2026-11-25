import readingTime from 'reading-time';

import { Label } from '@weco/common/model/labels';
import {
  QuoteSlice as RawQuoteSlice,
  TextSlice as RawTextSlice,
} from '@weco/common/prismicio-types';
import { pluralize } from '@weco/common/utils/grammar';
import { asText } from '@weco/content/services/prismic/transformers';
import { Format } from '@weco/content/types/format';
import { PrismicBodySlice } from '@weco/content/types/generic-content-fields';

// Calculating the full reading time of the article by getting all article text
function allArticleText(genericBody: PrismicBodySlice[]) {
  return genericBody
    .map(slice => {
      switch (slice.slice_type) {
        case 'text':
          // PrismicBodySlice doesn't carry `primary`, but inside these
          // case branches we know the concrete slice type from the runtime
          // slice_type check. TypeScript can't narrow a minimal type like
          // PrismicBodySlice automatically, so we cast explicitly.
          return asText((slice as RawTextSlice).primary.text);
        case 'quote':
          return asText((slice as RawQuoteSlice).primary.text);
        default:
          return '';
      }
    })
    .join(' ');
}

export function calculateReadingTime(
  body: PrismicBodySlice[]
): string | undefined {
  const articleText = allArticleText(body);

  const minutes = Math.ceil(readingTime(articleText).minutes);

  return minutes === 0 ? undefined : pluralize(minutes, 'minute');
}

export function showReadingTime(
  format: Format<string> | undefined,
  labels: Label[]
) {
  // This is getting a little unwieldy, as i am learning there
  // are a few formats we consider to be 'articles' even if their Prismic 'format'
  // doesn't return them as 'Article' e.g. Book extracts
  // TODO: get definitive list of what we consider to be article and refactor the below function to account for that
  return format
    ? Boolean(
        format?.title === 'Article' ||
        format?.title === 'Serial' ||
        format?.title === 'Book extract' ||
        format?.title === 'Long read' ||
        format?.title === 'Photo story' ||
        format?.title === 'Prose Poem'
      )
    : Boolean(labels[0]?.text === 'Serial' || labels[0]?.text === 'Article');
}
