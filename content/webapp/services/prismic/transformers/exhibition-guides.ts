import { ExhibitionGuide } from '../../../types/exhibition-guides';
import { ExhibitionGuidePrismicDocument } from '../types/exhibition-guides';

export function transformGuide(
  document: ExhibitionGuidePrismicDocument
): ExhibitionGuide {
  const { data } = document;
  // TODO transform all the bits
  return {
    type: 'exhibition-guides',
  };
}
