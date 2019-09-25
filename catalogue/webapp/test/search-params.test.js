import {
  searchParamsDeserialiser,
  searchParamsSerialiser,
} from '@weco/common/services/catalogue/search-params';

// @flow

describe('deserialises', () => {
  it('should deserialise with defaults for missing keys', () => {
    const params = searchParamsDeserialiser({});

    // string
    expect(params.query).toBe('');

    // nullable string
    expect(params.productionDatesFrom).toBe(null);

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
