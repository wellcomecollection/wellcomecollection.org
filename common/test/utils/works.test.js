// @flow

import {
  getProductionDates,
  getItemsWith,
  getItemIdentifiersWith,
  getWorkIdentifiersWith,
  getArchiveAncestorArray,
} from '../../utils/works';
import { getTabbableIds } from '../../views/components/ArchiveTree/ArchiveTree';
import { WorkFixture, workWithPartOf } from '../fixtures/catalogueApi/work';
import { uiTree, idArray } from '../fixtures/uiTree/uiTree';

describe('getProductionDates', () => {
  it('should extract date labels from a work', () => {
    const dateLabel = getProductionDates(WorkFixture);

    expect(dateLabel).toStrictEqual(['[between 1990 and 1999?]']);
  });
});

describe('getItemsWith', () => {
  it('gets the items with indicated by the parameters', () => {
    const items = getItemsWith(WorkFixture, {
      identifierId: 'sierra-system-number',
      locationType: 'PhysicalLocation',
    });

    expect(items.length).toBe(1);
    expect(items[0].id).toBe('ys3ern6x');
  });
});

describe('getWorkIdentifiersWith', () => {
  it('should get the work identifiers indicated by the parameters', () => {
    const identifiers = getWorkIdentifiersWith(WorkFixture, {
      identifierId: 'sierra-system-number',
    });

    expect(identifiers.length).toBe(1);
    expect(identifiers[0]).toBe('b16656180');
  });
});

describe('getItemIdentifiersWith', () => {
  it('gets the item identifiers indicated by the parameters', () => {
    const identifiers = getItemIdentifiersWith(
      WorkFixture,
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
  it('gets the ancestors of an archive work', () => {
    const archiveAncestorArray = getArchiveAncestorArray(workWithPartOf);
    expect(archiveAncestorArray).toStrictEqual([
      {
        id: 'hz43r7re',
        title: 'Francis Crick (1916-2004): archives',
        alternativeTitles: [],
        referenceNumber: 'PP/CRI',
        type: 'Work',
      },
      {
        id: 'gnfmdk33',
        title: 'Personal Material',
        alternativeTitles: [],
        referenceNumber: 'PP/CRI/A',
        type: 'Work',
      },
      {
        id: 'pwbpp7gj',
        title: 'Miscellaneous Personal Items',
        alternativeTitles: [],
        referenceNumber: 'PP/CRI/A/1',
        type: 'Work',
      },
      {
        id: 't9d9yrsx',
        title: 'Miscellaneous Photographs',
        alternativeTitles: [],
        referenceNumber: 'PP/CRI/A/1/2',
        type: 'Work',
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
