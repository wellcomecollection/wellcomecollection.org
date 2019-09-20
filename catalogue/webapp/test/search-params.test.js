import {
  searchParamsDeserialiser,
  searchParamsSerialiser,
} from '@weco/common/services/catalogue/search-params';

// @flow

describe('deserialises', () => {
  it('should deserialise with defaults for missing keys', () => {
    const params = searchParamsDeserialiser({});

    // boolean
    expect(params._isFilteringBySubcategory).toBe(false);

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
      _isFilteringBySubcategory: false,
      query: '',
      workType: null,
      page: 1,
      itemsLocationsLocationType: ['iiif-image', 'iiif-presentation'],
      aggregations: [],
    });

    // boolean exclusion
    expect(params._isFilteringBySubcategory).toBeNull();

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
