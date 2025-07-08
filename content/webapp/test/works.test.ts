import { idArray, uiTree } from '@weco/content/__mocks__/uiTree';
import {
  workFixture,
  workWithLibrarySeriesPartOf,
  workWithMixedPartOf,
  workWithPartOf,
} from '@weco/content/test/fixtures/catalogueApi/work';
import {
  getAccessConditionForDigitalLocation,
  getArchiveAncestorArray,
  getDigitalLocationOfType,
  getItemIdentifiersWith,
  getItemsWith,
  getProductionDates,
} from '@weco/content/utils/works';
import { getTabbableIds } from '@weco/content/views/pages/works/work/ArchiveTree/ArchiveTree.helpers';

describe('getProductionDates', () => {
  it('extracts date labels from a work', () => {
    const dateLabel = getProductionDates(workFixture);

    expect(dateLabel).toStrictEqual(['[between 1990 and 1999?]']);
  });
});

describe('getItemsWith', () => {
  it('gets the items with indicated by the parameters', () => {
    const items = getItemsWith(workFixture, {
      identifierId: 'sierra-system-number',
      locationType: 'PhysicalLocation',
    });

    expect(items.length).toBe(1);
    expect(items[0].id).toBe('ys3ern6x');
  });
});

describe('getItemIdentifiersWith', () => {
  it('gets the item identifiers indicated by the parameters', () => {
    const identifiers = getItemIdentifiersWith(
      workFixture,
      {
        identifierId: 'sierra-system-number',
        locationType: 'PhysicalLocation',
      },
      'sierra-system-number'
    );

    expect(identifiers.length).toBe(1);
    expect(identifiers[0]).toBe('i16010176');
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
        totalDescendentParts: 2678,
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
        partOf: [
          {
            alternativeTitles: [],
            availableOnline: false,
            availabilities: [],
            id: 'hz43r7re',
            partOf: [],
            referenceNumber: 'PP/CRI',
            title: 'Francis Crick (1916-2004): archives',
            totalDescendentParts: 2678,
            totalParts: 14,
            type: 'Collection',
          },
        ],
        totalDescendentParts: 50,
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
        partOf: [
          {
            alternativeTitles: [],
            availableOnline: false,
            availabilities: [],
            id: 'gnfmdk33',
            partOf: [
              {
                alternativeTitles: [],
                availableOnline: false,
                availabilities: [],
                id: 'hz43r7re',
                partOf: [],
                referenceNumber: 'PP/CRI',
                title: 'Francis Crick (1916-2004): archives',
                totalDescendentParts: 2678,
                totalParts: 14,
                type: 'Collection',
              },
            ],
            referenceNumber: 'PP/CRI/A',
            title: 'Personal Material',
            totalDescendentParts: 50,
            totalParts: 4,
            type: 'Section',
          },
        ],
        totalDescendentParts: 17,
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
        partOf: [
          {
            alternativeTitles: [],
            availableOnline: false,
            availabilities: [],
            id: 'pwbpp7gj',
            partOf: [
              {
                alternativeTitles: [],
                availableOnline: false,
                availabilities: [],
                id: 'gnfmdk33',
                partOf: [
                  {
                    alternativeTitles: [],
                    availableOnline: false,
                    availabilities: [],
                    id: 'hz43r7re',
                    partOf: [],
                    referenceNumber: 'PP/CRI',
                    title: 'Francis Crick (1916-2004): archives',
                    totalDescendentParts: 2678,
                    totalParts: 14,
                    type: 'Collection',
                  },
                ],
                referenceNumber: 'PP/CRI/A',
                title: 'Personal Material',
                totalDescendentParts: 50,
                totalParts: 4,
                type: 'Section',
              },
            ],
            referenceNumber: 'PP/CRI/A/1',
            title: 'Miscellaneous Personal Items',
            totalDescendentParts: 17,
            totalParts: 6,
            type: 'Section',
          },
        ],
        totalDescendentParts: 9,
        totalParts: 9,
        type: 'Series',
      },
    ]);
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
        totalDescendentParts: 2,
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
        totalDescendentParts: 1,
        alternativeTitles: [],
        availableOnline: false,
        availabilities: [],
        partOf: [
          {
            id: 'f00dcafe',
            referenceNumber: 'a',
            title: 'An Archive Series',
            type: 'Series',
            totalParts: 1,
            totalDescendentParts: 2,
            alternativeTitles: [],
            availableOnline: false,
            availabilities: [],
          },
        ],
      },
    ]);
  });
});

describe('getTabbableIds', () => {
  it('gets the ids from only the open branches of a uiTree and returns them as a flat array', () => {
    const tabbableIds = getTabbableIds(uiTree);
    expect(idArray).toEqual(tabbableIds);
  });
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
