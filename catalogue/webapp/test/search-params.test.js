import {
  searchParamsDeserialiser,
  apiSearchParamsSerialiser,
} from '@weco/common/services/catalogue/search-params';

// @flow

describe('deserialises', () => {
  it('should deserialise URLs', () => {
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
    expect(params.productionDatesTo).toStrictEqual(null);

    // nullable CSV
    expect(params.workType).toStrictEqual(null);

    // not in keys => undefined
    expect(params.shakeTheRoom).toBe(undefined);
  });

  it('should serialise with default values', () => {
    const params = apiSearchParamsSerialiser({
      query: '',
      workType: null,
      page: null,
      itemsLocationsLocationType: null,
      aggregations: [],
    });

    // nullable string exclusion
    expect(params.query).toBeNull();

    // number exclusion
    expect(params.page).toBe('1');

    // array that's empty
    expect(params.aggregations).toBeNull();

    // array with defaults
    expect(params['items.locations.locationType']).toBe(
      'iiif-image,iiif-presentation'
    );

    // array with defaults
    expect(params.workType).toBe('a,k,q,i,g');
  });
});
