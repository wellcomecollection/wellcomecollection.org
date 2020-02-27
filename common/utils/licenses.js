// @flow
import merge from 'lodash.merge';
// We have to deal with licenses in both the Catalogue App (using the catalogue API) and the Content App (using the Prismic API)
// The catalogue API provides licenses as follows:
export type LicenseAPIData = {|
  id: string,
  label: string,
  url: string,
  type: 'License',
|};
// For the UI, we want to add to this data, with an icons array, description and human readable text.
type CcIcons = 'cc' | 'ccBy' | 'ccNc' | 'ccNd' | 'ccPdm' | 'ccZero' | 'ccSa';
export type LicenseData = {|
  ...LicenseAPIData,
  icons: CcIcons[],
  description: ?string,
  humanReadableText: string[],
|};
// This is achieved with the getAugmentedLicenseInfo function and the data contained in the additionalData object.

// However, the only license information we receive from Prismic is a license id.
// We therefore duplicate the data that the catalogue API provides (defaultLicenseMap),
// combine it with the additionalData and use the getLicenseInfo function,
// for the sole purpose of displaying license information on the Content App.

export const additionalData = {
  pdm: {
    icons: ['ccPdm'],
    description: null,
    humanReadableText: [
      'You can use this work for any purpose without restriction under copyright law.',
      'Public Domain Mark (PDM) terms and conditions <a href="https://creativecommons.org/publicdomain/mark/1.0">https://creativecommons.org/publicdomain/mark/1.0</a>',
    ],
  },
  'cc-0': {
    icons: ['ccZero'],
    description: 'Free to use for any purpose',
    humanReadableText: [
      'You can use this work for any purpose without restriction under copyright law.',
      'Creative Commons Zero (CC0) terms and conditions <a href="https://creativecommons.org/publicdomain/zero/1.0">https://creativecommons.org/publicdomain/zero/1.0</a>',
    ],
  },
  'cc-by': {
    icons: ['cc', 'ccBy'],
    description: 'Free to use with attribution',
    humanReadableText: [
      'You can use this work for any purpose, including commercial uses, without restriction under copyright law. You should also provide attribution to the original work, source and licence.',
      'Creative Commons Attribution (CC BY 4.0) terms and conditions <a href="https://creativecommons.org/licenses/by/4.0">https://creativecommons.org/licenses/by/4.0</a>',
    ],
  },
  'cc-by-nc': {
    icons: ['cc', 'ccBy', 'ccNc'],
    description: 'Free to use with attribution for non-commercial purposes',
    humanReadableText: [
      'You can use this work for any purpose, as long as it is not primarily intended for or directed to commercial advantage or monetary compensation. You should also provide attribution to the original work, source and licence.',
      'Creative Commons Attribution Non-Commercial (CC BY-NC 4.0) terms and conditions <a href="https://creativecommons.org/licenses/by-nc/4.0">https://creativecommons.org/licenses/by-nc/4.0</a>',
    ],
  },
  'cc-by-nc-nd': {
    icons: ['cc', 'ccBy', 'ccNc', 'ccNd'],
    description:
      'Free to use with attribution for non-commercial purposes. No modifications permitted.',
    humanReadableText: [
      'You can copy and distribute this work, as long as it is not primarily intended for or directed to commercial advantage or monetary compensation. You should also provide attribution to the original work, source and licence.',
      'If you make any modifications to or derivatives of the work, it may not be distributed.',
      'Creative Commons Attribution Non-Commercial No-Derivatives (CC BY-NC-ND 4.0) terms and conditions <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">https://creativecommons.org/licenses/by-nc-nd/4.0/</a>',
    ],
  },
  'cc-by-nd': {
    icons: ['cc', 'ccBy', 'ccNd'],
    description: 'Free to use with attribution. No modifications permitted.',
    humanReadableText: [],
  },
  'cc-by-sa': {
    icons: ['cc', 'ccBy'],
    description: null,
    humanReadableText: [],
  },
  'cc-by-nc-sa': {
    icons: ['cc', 'ccBy', 'ccNc'],
    description: null,
    humanReadableText: [],
  },
  ogl: {
    icons: [],
    description: null,
    humanReadableText: [],
  },
  opl: {
    icons: [],
    description: null,
    humanReadableText: [],
  },
  inc: {
    icons: [],
    description: null,
    humanReadableText: [],
  },
};

export default function getAugmentedLicenseInfo(
  license: LicenseAPIData
): LicenseData {
  const additionalLicenseData = additionalData[license.id.toLowerCase()];
  return {
    ...license,
    ...additionalLicenseData,
  };
}

const defaultLicenseMap = {
  pdm: {
    id: 'pdm',
    label: 'Public Domain Mark',
    url: 'https://creativecommons.org/share-your-work/public-domain/pdm/',
    type: 'License',
  },
  'cc-0': {
    id: 'cc-0',
    label: 'CC0 1.0 Universal',
    url: 'https://creativecommons.org/publicdomain/zero/1.0/legalcode',
    type: 'License',
  },
  'cc-by': {
    id: 'cc-by',
    label: 'Attribution 4.0 International (CC BY 4.0)',
    url: 'https://creativecommons.org/licenses/by/4.0/',
    type: 'License',
  },
  'cc-by-nc': {
    id: 'cc-by-nc',
    label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
    url: 'https://creativecommons.org/licenses/by-nc/4.0/',
    type: 'License',
  },
  'cc-by-nc-nd': {
    id: 'cc-by-nc',
    label:
      'Attribution-NonCommercial-NoDerivatives 4.0 International (CC BY-NC-ND 4.0)',
    url: 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
    type: 'License',
  },
  'cc-by-nd': {
    id: 'cc-by-nd',
    label: 'Attribution-NoDerivatives 4.0 International (CC BY-ND 4.0)',
    url: 'https://creativecommons.org/licenses/by-nd/4.0/',
    type: 'License',
  },
  'cc-by-sa': {
    id: 'cc-by-sa',
    label: 'Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)',
    url: 'https://creativecommons.org/licenses/by-sa/4.0/',
    type: 'License',
  },
  'cc-by-nc-sa': {
    id: 'cc-by-nc-sa',
    label:
      'Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)',
    url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
    type: 'License',
  },
  ogl: {
    id: 'ogl',
    label: 'Open Government License',
    url:
      'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
    type: 'License',
  },
  opl: {
    id: 'opl',
    label: 'Open Parliament License',
    url:
      'https://www.parliament.uk/site-information/copyright-parliament/open-parliament-licence',
    type: 'License',
  },
  inc: {
    id: 'inc',
    label: 'In copyright',
    url: 'http://rightsstatements.org/vocab/InC/1.0/',
    type: 'License',
  },
};

export const mergedLicenseMap = merge(additionalData, defaultLicenseMap);

export function getLicenseInfo(licenseId: string): LicenseData {
  return mergedLicenseMap[licenseId.toLowerCase()];
}
