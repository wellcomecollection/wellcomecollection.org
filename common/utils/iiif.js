// @flow
import { type IIIFManifest } from '../model/iiif';
import getLicenseInfo, { type LicenseData } from './get-license-info';
import { getIIIFMetadata } from './works';

export function getIIIFPresentationLicenceInfo(
  manifest: IIIFManifest
): ?LicenseData {
  const licenseData = manifest.license
    ? getLicenseInfo(manifest.license) || {
        text: 'License',
        url: manifest.license,
        humanReadableText: [],
      }
    : null;
  return licenseData;
}

export function getIIIFPresentationCredit(manifest: IIIFManifest): ?string {
  const attribution = getIIIFMetadata(manifest, 'Attribution');
  return attribution ? attribution.value.split('<br/>')[0] : null;
}

export function getIIIFImageLicenceInfo(image: Object): ?LicenseData {
  const licenseData =
    image.license && image.license.id && getLicenseInfo(image.license.id);
  return licenseData;
}

export function getIIIFImageCredit(image: Object): ?string {
  return image.credit;
}
