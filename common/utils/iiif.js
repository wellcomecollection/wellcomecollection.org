// @flow
import { type IIIFManifest } from '../model/iiif';
import { getIIIFMetadata } from './works';

export function getIIIFPresentationCredit(manifest: IIIFManifest): ?string {
  const attribution = getIIIFMetadata(manifest, 'Attribution');
  return attribution ? attribution.value.split('<br/>')[0] : null;
}

export function getIIIFImageCredit(image: Object): ?string {
  return image.credit;
}
