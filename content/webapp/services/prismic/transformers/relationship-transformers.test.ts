import * as prismic from '@prismicio/client';

import { transformGenericFieldsFromRelationship } from '@weco/content/services/prismic/transformers';

import {
  transformPlaceFromRelationship,
  transformPlacesFromRelationshipGroup,
} from './places';
import {
  transformSeasonFromRelationship,
  transformSeasonsFromRelationshipGroup,
} from './seasons';

type FilledRelationship = prismic.FilledContentRelationshipField<
  string,
  string,
  unknown
>;

const richText = (text: string): prismic.RichTextField => [
  { type: 'heading1', text, spans: [] },
];

const filledRelationship = (overrides: Partial<FilledRelationship>) =>
  ({
    link_type: 'Document',
    id: 'Yabc123',
    uid: 'a-uid',
    type: 'seasons',
    tags: [],
    lang: 'en-gb',
    isBroken: false,
    data: {},
    ...overrides,
  }) as unknown as FilledRelationship;

describe('transformGenericFieldsFromRelationship', () => {
  it('extracts title/body and ignores non-editorial promo slices', () => {
    const generic = transformGenericFieldsFromRelationship({
      id: 'X1',
      data: {
        title: richText('Hello'),
        body: [],
        promo: [{ slice_type: 'not-editorial-image' }],
        metadataDescription: 'Desc',
      },
    });

    expect(generic.id).toBe('X1');
    expect(generic.title).toBe('Hello');
    expect(generic.untransformedBody).toEqual([]);
    expect(generic.promo).toBeUndefined();
    expect(generic.image).toBeUndefined();
    expect(generic.metadataDescription).toBe('Desc');
  });

  it('is defensive when fields are missing', () => {
    const generic = transformGenericFieldsFromRelationship({
      id: 'X2',
      data: {},
    });

    expect(generic.id).toBe('X2');
    expect(generic.title).toBe('');
    expect(generic.untransformedBody).toEqual([]);
  });
});

describe('season relationship transformers', () => {
  it('returns undefined when uid is missing', () => {
    const season = transformSeasonFromRelationship(
      filledRelationship({ type: 'seasons', uid: undefined })
    );

    expect(season).toBeUndefined();
  });

  it('transforms a filled season relationship', () => {
    const season = transformSeasonFromRelationship(
      filledRelationship({
        type: 'seasons',
        uid: 'my-season',
        data: {
          title: richText('My Season'),
          body: [],
          promo: [],
        },
      })
    );

    expect(season?.type).toBe('seasons');
    expect(season?.uid).toBe('my-season');
    expect(season?.title).toBe('My Season');
  });

  it('filters out non-season relationships in group helper', () => {
    const seasons = transformSeasonsFromRelationshipGroup([
      filledRelationship({
        type: 'seasons',
        uid: 's1',
        data: { title: richText('S1'), body: [], promo: [] },
      }),
      filledRelationship({
        type: 'places',
        uid: 'p1',
        data: { title: richText('P1'), body: [], promo: [] },
      }),
    ]);

    expect(seasons).toHaveLength(1);
    expect(seasons[0].uid).toBe('s1');
  });
});

describe('place relationship transformers', () => {
  it('transforms a filled place relationship', () => {
    const place = transformPlaceFromRelationship(
      filledRelationship({
        type: 'places',
        uid: 'gallery-1',
        data: {
          title: richText('Gallery 1'),
          body: [],
          promo: [],
          level: 2,
          capacity: 50,
          locationInformation: richText('Info'),
        },
      })
    );

    expect(place?.title).toBe('Gallery 1');
    expect(place?.level).toBe(2);
    expect(place?.capacity).toBe(50);
    expect(place?.information).toEqual(richText('Info'));
  });

  it('filters out non-place relationships in group helper', () => {
    const places = transformPlacesFromRelationshipGroup([
      filledRelationship({
        type: 'places',
        uid: 'p1',
        data: { title: richText('P1'), body: [], promo: [], level: 1 },
      }),
      filledRelationship({
        type: 'seasons',
        uid: 's1',
        data: { title: richText('S1'), body: [], promo: [] },
      }),
    ]);

    expect(places).toHaveLength(1);
    expect(places[0].title).toBe('P1');
  });
});
