// License/Licence is due to US/UK spelling
// APIs and their data use the former (US's "license") whilst our UI uses the latter (UK's "licence").
//
// We have to deal with licenses from two sources:
//
//    - the catalogue API (in the catalogue app), which returns the LicenseAPIData type
//    - the Prismic API (in the content app)
//
// The catalogue API provides licenses as the `CatalogueLicenseData` type; the
// Prismic API only returns a license ID.
//
// We augment the catalogue API types with extra data (e.g. icons and human-readable
// text) so we can display licenses properly in the catalogue app.

import { ReactElement } from 'react';

type CatalogueLicenseData = {
  id: string;
  label: string;
  url: string;
  type: 'License';
};

type CcIcons = 'cc' | 'ccBy' | 'ccNc' | 'ccNd' | 'ccPdm' | 'ccZero' | 'ccSa';
export type LicenseData = CatalogueLicenseData & {
  icons: CcIcons[];
  description?: string;
  humanReadableText?: ReactElement;
};

const additionalData = {
  pdm: {
    icons: ['ccPdm'],
    humanReadableText: (
      <>
        <div>
          You can use this work for any purpose without restriction under
          copyright law.
        </div>
        <div>
          Public Domain Mark (PDM) terms and conditions{' '}
          <a href="https://creativecommons.org/publicdomain/mark/1.0">
            https://creativecommons.org/publicdomain/mark/1.0
          </a>
        </div>
      </>
    ),
  },
  'cc-0': {
    icons: ['ccZero'],
    description: 'Free to use for any purpose',
    humanReadableText: (
      <>
        <div>
          You can use this work for any purpose without restriction under
          copyright law.
        </div>
        <div>
          Creative Commons Zero (CC0) terms and conditions{' '}
          <a href="https://creativecommons.org/publicdomain/zero/1.0">
            https://creativecommons.org/publicdomain/zero/1.0
          </a>
        </div>
      </>
    ),
  },
  'cc-by': {
    icons: ['cc', 'ccBy'],
    description: 'Free to use with attribution',
    humanReadableText: (
      <>
        <div>
          You can use this work for any purpose, including commercial uses,
          without restriction under copyright law. You should also provide
          attribution to the original work, source and licence.
        </div>
        <div>
          Creative Commons Attribution (CC BY 4.0) terms and conditions{' '}
          <a href="https://creativecommons.org/licenses/by/4.0">
            https://creativecommons.org/licenses/by/4.0
          </a>
        </div>
      </>
    ),
  },
  'cc-by-nc': {
    icons: ['cc', 'ccBy', 'ccNc'],
    description: 'Free to use with attribution for non-commercial purposes',
    humanReadableText: (
      <>
        <div>
          You can use this work for any purpose, as long as it is not primarily
          intended for or directed to commercial advantage or monetary
          compensation. You should also provide attribution to the original
          work, source and licence.
        </div>
        <div>
          Creative Commons Attribution Non-Commercial (CC BY-NC 4.0) terms and
          conditions{' '}
          <a href="https://creativecommons.org/licenses/by-nc/4.0">
            https://creativecommons.org/licenses/by-nc/4.0
          </a>
        </div>
      </>
    ),
  },
  'cc-by-nc-nd': {
    icons: ['cc', 'ccBy', 'ccNc', 'ccNd'],
    description:
      'Free to use with attribution for non-commercial purposes. No modifications permitted.',
    humanReadableText: (
      <>
        <div>
          You can copy and distribute this work, as long as it is not primarily
          intended for or directed to commercial advantage or monetary
          compensation. You should also provide attribution to the original
          work, source and licence.
        </div>
        <div>
          If you make any modifications to or derivatives of the work, it may
          not be distributed.
        </div>
        <div>
          Creative Commons Attribution Non-Commercial No-Derivatives (CC
          BY-NC-ND 4.0) terms and conditions{' '}
          <a href="https://creativecommons.org/licenses/by-nc-nd/4.0/">
            https://creativecommons.org/licenses/by-nc-nd/4.0/
          </a>
        </div>
      </>
    ),
  },
  'cc-by-nd': {
    icons: ['cc', 'ccBy', 'ccNd'],
    description: 'Free to use with attribution. No modifications permitted.',
  },
  'cc-by-sa': {
    icons: ['cc', 'ccBy'],
  },
  'cc-by-nc-sa': {
    icons: ['cc', 'ccBy', 'ccNc'],
  },
  ogl: {
    icons: [],
  },
  opl: {
    icons: [],
  },
  inc: {
    icons: [],
  },
};

const catalogueLicenses: Record<string, CatalogueLicenseData> = {
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
    label: 'Open Government Licence',
    url: 'http://www.nationalarchives.gov.uk/doc/open-government-licence/version/3/',
    type: 'License',
  },
  opl: {
    id: 'opl',
    label: 'Open Parliament Licence',
    url: 'https://www.parliament.uk/site-information/copyright-parliament/open-parliament-licence',
    type: 'License',
  },
  inc: {
    id: 'inc',
    label: 'In copyright',
    url: 'http://rightsstatements.org/vocab/InC/1.0/',
    type: 'License',
  },
};

// Given a license from the catalogue API, return the license with extra
// information needed to display it in the UI.
export function getCatalogueLicenseData(
  license: CatalogueLicenseData
): LicenseData {
  const additionalLicenseData = additionalData[license.id.toLowerCase()];
  return {
    ...license,
    ...additionalLicenseData,
  };
}

// Given a license ID from Prismic, return the equivalent license data as
// we'd receive it from the catalogue API.
//
// Note: we don't include the augmented data here because the content app doesn't
// use it.  (At time of writing, the only component that uses license data is <Tasl>,
// which wants a URL and label.)
export function getPrismicLicenseData(licenseId: string): CatalogueLicenseData {
  return catalogueLicenses[licenseId.toLowerCase()];
}
