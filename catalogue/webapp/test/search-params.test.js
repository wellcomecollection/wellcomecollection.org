import {
  searchParamsDeserialiser,
  searchParamsSerialiser,
} from '@weco/common/services/catalogue/search-params';

// @flow

describe('deserialises', () => {
  it('should deserialise with defaults for missing keys', () => {
    const params = searchParamsDeserialiser(
      {
        'production.dates.from': '1900',
      },
      {
        'production.dates.from': 'productionDatesFrom',
        'production.dates.to': 'productionDatesTo',
      }
    );

    // string
    expect(params.query).toBe('');

    // different key
    expect(params.productionDatesFrom).toBe('1900');

    // nullable string
    expect(params.productionDatesTo).toBe(null);

    // array with defaults
    expect(params.workType).toStrictEqual(['a', 'k', 'q', 'v', 'f', 's']);

    // not in keys => undefined
    expect(params.shakeTheRoom).toBe(undefined);
  });

  it('should serialise removing default values', () => {
    const params = searchParamsSerialiser({
      query: '',
      workType: null,
      page: 1,
      itemsLocationsLocationType: ['iiif-image', 'iiif-presentation'],
      aggregations: [],
    });

    // nullable string exclusion
    expect(params.query).toBeNull();

    // number exclusion
    expect(params.page).toBeNull();

    // array that's empty
    expect(params.aggregations).toBeNull();

    // array serialisation with alternative param name and defaults
    expect(params['items.locations.locationType']).toBe(null);

    // array with defaults
    expect(params.workType).toBe('a,k,q,v,f,s');
  });
});
