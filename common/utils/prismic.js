// @flow
import type {HTMLString} from '../services/prismic/types';

export function createPrismicParagraph(text: string): HTMLString {
  return [{
    text,
    type: 'paragraph',
    spans: []
  }];
}
