import readingTime from 'reading-time';
import { asText } from '@weco/content/services/prismic/transformers';

import { BodySlice } from '@weco/content/types/body';
import { Format } from '@weco/content/types/format';
import { Label } from '@weco/common/model/labels';
import { pluralize } from '@weco/common/utils/grammar';

// Calculating the full reading time of the article by getting all article text
function allArticleText(genericBody: BodySlice[]) {
  return genericBody
    .map(slice => {
      switch (slice.type) {
        case 'text':
          return asText(slice.value);
        case 'quote':
          return asText(slice.value.text);
        default:
          return '';
      }
    })
    .join(' ');
}

export function calculateReadingTime(body: BodySlice[]): string | undefined {
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
