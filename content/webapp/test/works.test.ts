import { DigitalLocation } from '@weco/common/model/catalogue';
import {
  workFixture,
  workWithLibrarySeriesPartOf,
  workWithMixedPartOf,
  workWithPartOf,
} from '@weco/content/test/fixtures/catalogueApi/work';
import { TransformedManifest } from '@weco/content/types/manifest';
import {
  getAccessConditionForDigitalLocation,
  getArchiveAncestorArray,
  getDigitalLocationOfType,
  getFileLabel,
  getHasViewableIIIFContent,
  getProductionDates,
  showItemLink,
} from '@weco/content/utils/works';

const iiifImageLocation = getDigitalLocationOfType(
  workFixture,
  'iiif-image'
) as DigitalLocation;

const iiifPresentationLocation = getDigitalLocationOfType(
  workFixture,
  'iiif-presentation'
) as DigitalLocation;

const transformedManifest = {} as TransformedManifest;

describe('getProductionDates', () => {
  it('extracts date labels from a work', () => {
    const dateLabel = getProductionDates(workFixture);

    expect(dateLabel).toStrictEqual(['[between 1990 and 1999?]']);
  });
});

describe('getArchiveAncestorArray', () => {
  it('Does not get the ancestors of a non-archive work', () => {
    const archiveAncestorArray = getArchiveAncestorArray(
      workWithLibrarySeriesPartOf
    );
    expect(archiveAncestorArray).toStrictEqual([]);
  });

  it('gets the ancestors of an archive work', () => {
    const archiveAncestorArray = getArchiveAncestorArray(workWithPartOf);
    expect(archiveAncestorArray).toStrictEqual([
      {
        id: 'hz43r7re',
        title: 'Francis Crick (1916-2004): archives',
        alternativeTitles: [],
        referenceNumber: 'PP/CRI',
        availableOnline: false,
        availabilities: [],
        totalParts: 14,
        partOf: [],
        type: 'Collection',
      },
      {
        id: 'gnfmdk33',
        title: 'Personal Material',
        alternativeTitles: [],
        referenceNumber: 'PP/CRI/A',
        availableOnline: false,
        availabilities: [],
        totalParts: 4,
        type: 'Section',
      },
      {
        id: 'pwbpp7gj',
        title: 'Miscellaneous Personal Items',
        alternativeTitles: [],
        referenceNumber: 'PP/CRI/A/1',
        availableOnline: false,
        availabilities: [],
        totalParts: 6,
        type: 'Section',
      },
      {
        id: 't9d9yrsx',
        title: 'Miscellaneous Photographs',
        alternativeTitles: [],
        referenceNumber: 'PP/CRI/A/1/2',
        availableOnline: false,
        availabilities: [],
        totalParts: 9,
        type: 'Series',
      },
    ]);
  });
});

it('Does not return non-archive parents', () => {
  const archiveAncestorArray = getArchiveAncestorArray(workWithMixedPartOf);
  expect(archiveAncestorArray).toStrictEqual([
    {
      id: 'f00dcafe',
      referenceNumber: 'a',
      title: 'An Archive Series',
      type: 'Series',
      totalParts: 1,
      alternativeTitles: [],
      availableOnline: false,
      availabilities: [],
    },
    {
      id: 'cafebeef',
      referenceNumber: 'a/b',
      title: 'An Archive Collection',
      type: 'Collection',
      totalParts: 1,
      alternativeTitles: [],
      availableOnline: false,
      availabilities: [],
    },
  ]);
});

describe('getDigitalLocationOfType', () => {
  it('returns the digital location with the specified id', () => {
    const manifestLocation = getDigitalLocationOfType(
      workWithPartOf,
      'iiif-presentation'
    );
    expect(manifestLocation).toStrictEqual({
      locationType: {
        id: 'iiif-presentation',
        label: 'IIIF Presentation API',
        type: 'LocationType',
      },
      url: 'https://wellcomelibrary.org/iiif/b16129143/manifest',
      license: {
        id: 'cc-by-nc',
        label: 'Attribution-NonCommercial 4.0 International (CC BY-NC 4.0)',
        url: 'https://creativecommons.org/licenses/by-nc/4.0/',
        type: 'License',
      },
      accessConditions: [
        {
          status: {
            id: 'open',
            label: 'Open',
            type: 'AccessStatus',
          },
          type: 'AccessCondition',
        },
      ],
      type: 'DigitalLocation',
    });
  });
});

describe('getAccessConditionForDigitalLocation', () => {
  it('returns the status.id of the first object in an accessConditions array with a status property', () => {
    const manifestLocation = getDigitalLocationOfType(
      workWithPartOf,
      'iiif-presentation'
    );

    // In the test this will always be true, but types are complaining as it could technically be undefined
    if (manifestLocation) {
      const statusId = getAccessConditionForDigitalLocation(manifestLocation);
      expect(statusId).toEqual('open');
    }
  });
});

describe('showItemLink', () => {
  it('returns false when the access condition is closed', () => {
    expect(
      showItemLink({
        userIsStaffWithRestricted: false,
        hasViewableIIIFContent: true,
        accessCondition: 'closed',
      })
    ).toBe(false);
  });

  it('returns false when the access condition is restricted and the user is not staff with restricted access', () => {
    expect(
      showItemLink({
        userIsStaffWithRestricted: false,
        hasViewableIIIFContent: true,
        accessCondition: 'restricted',
      })
    ).toBe(false);
  });

  it('returns true when the access condition is restricted and the user is staff with restricted access', () => {
    expect(
      showItemLink({
        userIsStaffWithRestricted: true,
        hasViewableIIIFContent: true,
        accessCondition: 'restricted',
      })
    ).toBe(true);
  });

  it('returns true for an open work with viewable IIIF content', () => {
    expect(
      showItemLink({
        userIsStaffWithRestricted: false,
        hasViewableIIIFContent: true,
        accessCondition: 'open',
      })
    ).toBe(true);
  });

  it('returns false when there is no viewable IIIF content', () => {
    expect(
      showItemLink({
        userIsStaffWithRestricted: false,
        hasViewableIIIFContent: false,
        accessCondition: 'open',
      })
    ).toBe(false);
  });
});

describe('getHasViewableIIIFContent', () => {
  it('returns true for an iiif-image-only work, with no manifest to load', () => {
    expect(
      getHasViewableIIIFContent({
        iiifImageLocation,
        iiifPresentationLocation: undefined,
        isLoadingManifest: false,
        transformedManifest: undefined,
      })
    ).toBe(true);
  });

  it('returns true for a born-digital work while its manifest is still loading (optimistic)', () => {
    expect(
      getHasViewableIIIFContent({
        iiifImageLocation: undefined,
        iiifPresentationLocation,
        isLoadingManifest: true,
        transformedManifest: undefined,
      })
    ).toBe(true);
  });

  it('returns true for a born-digital work whose manifest has loaded successfully', () => {
    expect(
      getHasViewableIIIFContent({
        iiifImageLocation: undefined,
        iiifPresentationLocation,
        isLoadingManifest: false,
        transformedManifest,
      })
    ).toBe(true);
  });

  it('returns false for a born-digital work whose manifest 404s', () => {
    expect(
      getHasViewableIIIFContent({
        iiifImageLocation: undefined,
        iiifPresentationLocation,
        isLoadingManifest: false,
        transformedManifest: undefined,
      })
    ).toBe(false);
  });

  it('returns false when there is no digital location at all', () => {
    expect(
      getHasViewableIIIFContent({
        iiifImageLocation: undefined,
        iiifPresentationLocation: undefined,
        isLoadingManifest: false,
        transformedManifest: undefined,
      })
    ).toBe(false);
  });
});

describe('getFileLabel', () => {
  it('returns the given label', () => {
    expect(getFileLabel('A file title')).toBe('A file title');
  });

  it('falls back to unknown title when label is missing', () => {
    expect(getFileLabel(undefined)).toBe('unknown title');
  });

  it("falls back to unknown title when label is the API's '-' placeholder", () => {
    expect(getFileLabel('-')).toBe('unknown title');
  });

  it('falls back to a given titleOverride instead of the default', () => {
    expect(getFileLabel(undefined, 'a custom title')).toBe('a custom title');
  });
});
