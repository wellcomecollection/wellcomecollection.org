import { DigitalGuide } from '../../../types/digital-guides';
import { DigitalGuidePrismicDocument } from '../types/digital-guides';

export function transformGuide(
  document: DigitalGuidePrismicDocument
): DigitalGuide {
  const { data } = document;
  // TODO transform all the bits
  return {
    type: 'digital-guides',
  };
}
