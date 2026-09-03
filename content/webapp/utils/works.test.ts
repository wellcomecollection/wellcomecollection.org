import { Work } from '@weco/content/services/wellcome/catalogue/types';

import { isArchiveCollectionRoot } from './works';

type PredicateWork = Pick<Work, 'collection' | 'workType' | 'identifiers'>;

const teiIdentifier: Work['identifiers'][number] = {
  value: 'MS_632',
  identifierType: {
    id: 'tei-manuscript-id',
    label: 'TEI manuscript id',
    type: 'IdentifierType',
  },
  type: 'Identifier',
};

const calmIdentifier: Work['identifiers'][number] = {
  value: 'RAMC',
  identifierType: {
    id: 'calm-ref-no',
    label: 'Calm RefNo',
    type: 'IdentifierType',
  },
  type: 'Identifier',
};

const work = ({
  isRoot = true,
  totalParts = 5,
  workTypeId = 'h',
  identifiers = [calmIdentifier],
}: {
  isRoot?: boolean;
  totalParts?: number;
  workTypeId?: string;
  identifiers?: Work['identifiers'];
} = {}): PredicateWork => ({
  collection: {
    root: {
      id: 'abcd1234',
      title: 'A collection',
      alternativeTitles: [],
      totalParts,
      type: 'Collection',
    },
    ...(isRoot ? { isRoot: true } : {}),
  },
  workType: { id: workTypeId, label: 'A format', type: 'Format' },
  identifiers,
});

describe('isArchiveCollectionRoot', () => {
  it('is true for an archive collection root with children', () => {
    expect(isArchiveCollectionRoot(work())).toBe(true);
  });

  it('is true for a born-digital archive', () => {
    expect(isArchiveCollectionRoot(work({ workTypeId: 'hdig' }))).toBe(true);
  });

  it('is true for an archive with no recognised archive category', () => {
    // e.g. RAMC - `archive.category` is absent, but it is still an archive.
    // This is the case the old `archive.category` check wrongly excluded.
    expect(isArchiveCollectionRoot(work({ totalParts: 1507 }))).toBe(true);
  });

  it('is false for a singleton, i.e. a root with no children', () => {
    expect(isArchiveCollectionRoot(work({ totalParts: 0 }))).toBe(false);
  });

  it('is false for a work that is not a collection root', () => {
    expect(isArchiveCollectionRoot(work({ isRoot: false }))).toBe(false);
  });

  it('is false for a work with no collection at all', () => {
    expect(isArchiveCollectionRoot({ ...work(), collection: undefined })).toBe(
      false
    );
  });

  it('is false for a TEI manuscript, even though its format is "Archives and manuscripts"', () => {
    expect(
      isArchiveCollectionRoot(
        work({ totalParts: 1, identifiers: [teiIdentifier, calmIdentifier] })
      )
    ).toBe(false);
  });

  it('is false for a Manuscripts-format collection root', () => {
    expect(isArchiveCollectionRoot(work({ workTypeId: 'b' }))).toBe(false);
  });

  it('is false for a collection root that is not an archive format', () => {
    // e.g. a Pictures or Books root - a collection, but not an archive.
    expect(isArchiveCollectionRoot(work({ workTypeId: 'a' }))).toBe(false);
  });

  it('is false when the work has no format', () => {
    expect(isArchiveCollectionRoot({ ...work(), workType: undefined })).toBe(
      false
    );
  });
});
