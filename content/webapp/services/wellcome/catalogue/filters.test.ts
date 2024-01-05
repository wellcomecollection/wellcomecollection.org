import worksAggregations from './fixtures/works-aggregations';
import imagesAggregations from './fixtures/images-aggregations';
import { CheckboxFilter, imagesFilters, worksFilters } from './filters';
import { fromQuery as fromWorksQuery } from '@weco/content/components/SearchPagesLink/Works';
import {
  fromQuery as fromImagesQuery,
  ImagesProps,
} from '@weco/content/components/SearchPagesLink/Images';

// These tests require some knowledge of the fixture data.
// A bit odd, but it works.
describe('filter options', () => {
  it('0 count values: includes selected, excludes non-selected', () => {
    const filters = worksFilters({
      works: worksAggregations,
      props: fromWorksQuery({
        languages: 'map,niu',
        workType: 'c',
      }),
    });

    const languageFilter = filters.find(
      f => f.id === 'languages'
    ) as CheckboxFilter;

    const workTypeFilter = filters.find(
      f => f.id === 'workType'
    ) as CheckboxFilter;

    expect(
      languageFilter.options
        .filter(option => option.count === 0)
        .map(option => option.value)
        .sort()
    ).toEqual(['map', 'niu']);

    expect(
      workTypeFilter.options.find(option => option.id === 'c')
    ).toBeTruthy();

    expect(
      workTypeFilter.options.find(option => option.id === 'u')
    ).toBeFalsy();
  });

  it('sorts options by count descending then label ascending', () => {
    const filter = worksFilters({
      works: worksAggregationsWith('subjects.label', [
        {
          data: {
            label: 'Astronauts',
            type: 'Subject',
          },
          count: 666,
          type: 'AggregationBucket',
        },
        {
          data: {
            label: 'Zouaves',
            type: 'Subject',
          },
          count: 999,
          type: 'AggregationBucket',
        },
        {
          data: {
            label: 'Zeppelins',
            type: 'Subject',
          },
          count: 100,
          type: 'AggregationBucket',
        },
        {
          data: {
            label: 'Aardvarks',
            type: 'Subject',
          },
          count: 100,
          type: 'AggregationBucket',
        },
      ]),
      props: fromWorksQuery({}),
    }).find(f => f.id === 'subjects.label') as CheckboxFilter;

    expect(filter.options.map(option => option.count)).toEqual([
      999, 666, 100, 100,
    ]);

    expect(filter.options.map(option => option.label)).toEqual([
      'Zouaves',
      'Astronauts',
      'Aardvarks',
      'Zeppelins',
    ]);
  });

  it('presents options with zero matching records at the top of the list', () => {
    const filter = worksFilters({
      works: worksAggregationsWith('subjects.label', [
        {
          data: {
            label: 'Astronauts',
            type: 'Subject',
          },
          count: 3,
          type: 'AggregationBucket',
        },
        {
          data: {
            label: 'Zouaves',
            type: 'Subject',
          },
          count: 0,
          type: 'AggregationBucket',
        },
        {
          data: {
            label: 'Zeppelins',
            type: 'Subject',
          },
          count: 1,
          type: 'AggregationBucket',
        },
        {
          data: {
            label: 'Aardvarks',
            type: 'Subject',
          },
          count: 2,
          type: 'AggregationBucket',
        },
      ]),
      props: fromWorksQuery({ 'subjects.label': '"Zouaves"' }),
    }).find(f => f.id === 'subjects.label') as CheckboxFilter;

    expect(filter.options.map(option => option.count)).toEqual([0, 3, 2, 1]);

    expect(filter.options.map(option => option.label)).toEqual([
      'Zouaves',
      'Astronauts',
      'Aardvarks',
      'Zeppelins',
    ]);
  });

  describe('when options in the query are not present in the API aggregation', () => {
    it('includes the selected option from the query', () => {
      const filter = worksFilters({
        works: worksAggregationsWith('contributors.agent.label', []),
        props: fromWorksQuery({
          // An aggregation we know isn't in the fixture response
          'contributors.agent.label': '"Non existent"',
        }),
      }).find(f => f.id === 'contributors.agent.label') as CheckboxFilter;

      expect(filter.options[0].label).toEqual('Non existent');

      expect(filter.options[0].selected).toBeTruthy();
    });

    it('does not present a bogus count for the requested option', () => {
      const filter = worksFilters({
        works: worksAggregationsWith('contributors.agent.label', []),
        props: fromWorksQuery({
          // An aggregation we know isn't in the fixture response
          'contributors.agent.label': '"Non existent"',
        }),
      }).find(f => f.id === 'contributors.agent.label') as CheckboxFilter;

      expect(filter.options[0].count).toBeUndefined();
    });

    it('places the requested options above the aggregation options, sorted alphabetically', () => {
      const filter = worksFilters({
        works: worksAggregationsWith('subjects.label', [
          {
            data: {
              label: 'Aardvarks',
              type: 'Subject',
            },
            count: 100,
            type: 'AggregationBucket',
          },
        ]),
        props: fromWorksQuery({
          'subjects.label': '"Zeppelins", "Bananas"',
        }),
      }).find(f => f.id === 'subjects.label') as CheckboxFilter;

      expect(filter.options.map(option => option.label)).toEqual([
        'Bananas',
        'Zeppelins',
        'Aardvarks',
      ]);
    });

    it('treats the absence of a count the same as a zero count', () => {
      const filter = worksFilters({
        works: worksAggregationsWith('subjects.label', [
          {
            data: {
              label: 'Aardvarks',
              type: 'Subject',
            },
            count: 0,
            type: 'AggregationBucket',
          },
          {
            data: {
              label: 'XYZZY',
              type: 'Subject',
            },
            count: 0,
            type: 'AggregationBucket',
          },
          {
            data: {
              label: 'Plugh!',
              type: 'Subject',
            },
            count: 999,
            type: 'AggregationBucket',
          },
        ]),
        props: fromWorksQuery({
          'subjects.label': '"Zeppelins", "Bananas", "Aardvarks", "XYZZY"',
        }),
      }).find(f => f.id === 'subjects.label') as CheckboxFilter;

      expect(filter.options.map(option => option.count)).toEqual([
        0,
        undefined,
        0,
        undefined,
        999,
      ]);

      expect(filter.options.map(option => option.label)).toEqual([
        'Aardvarks',
        'Bananas',
        'XYZZY',
        'Zeppelins',
        'Plugh!',
      ]);
    });
  });

  describe('duplicate buckets', () => {
    const aggregationsWithDuplicates = worksAggregationsWith('subjects.label', [
      {
        data: {
          label: 'University of Glasgow. Library.',
          type: 'Subject',
        },
        count: 100,
        type: 'AggregationBucket',
      },
      {
        data: {
          label: 'Public Health.',
          type: 'Subject',
        },
        count: 65705,
        type: 'AggregationBucket',
      },
      {
        data: {
          label: 'University of Glasgow. Library.',
          type: 'Subject',
        },
        count: 5,
        type: 'AggregationBucket',
      },
    ]);

    const filter = worksFilters({
      works: aggregationsWithDuplicates,
      props: fromWorksQuery({}),
    }).find(f => f.id === 'subjects.label') as CheckboxFilter;

    it('filters duplicate labels from the aggregation buckets', () => {
      expect(filter.options.length).toBe(2);
    });

    it('sums the counts from homonymous buckets', () => {
      expect(
        filter.options.find(
          option => option.label === 'University of Glasgow. Library.'
        )?.count
      ).toBe(105);
    });
  });

  describe('matching query options to aggregation options', () => {
    const workTypeAggregations = {
      aggregations: {
        workType: {
          buckets: [
            {
              data: {
                id: 'a',
                label: 'Books',
                type: 'Format',
              },
              count: 113802,
              type: 'AggregationBucket',
            },
            {
              data: {
                id: 'h',
                label: 'Archives and manuscripts',
                type: 'Format',
              },
              count: 13402,
              type: 'AggregationBucket',
            },
            {
              data: {
                id: 'k',
                label: 'Pictures',
                type: 'Format',
              },
              count: 3755,
              type: 'AggregationBucket',
            },
          ],
        },
        availabilities: { buckets: [] },
        languages: {
          buckets: [
            {
              data: {
                id: 'wel',
                label: 'Welsh',
                type: 'Language',
              },
              count: 33,
              type: 'AggregationBucket',
            },
            {
              data: {
                id: 'nor',
                label: 'Norwegian',
                type: 'Language',
              },
              count: 21,
              type: 'AggregationBucket',
            },
          ],
        },
      },
    };

    const filters = worksFilters({
      works: workTypeAggregations,
      props: fromWorksQuery({
        languages: 'wel,nor',
        workType: 'k',
      }),
    });

    it('matches based on value, which may or may not be the same as label', () => {
      const workTypeFilter = filters.find(
        f => f.id === 'workType'
      ) as CheckboxFilter;
      const languageFilter = filters.find(
        f => f.id === 'languages'
      ) as CheckboxFilter;
      expect(workTypeFilter.options.map(option => option.label)).toEqual([
        'Books',
        'Archives and manuscripts',
        'Pictures',
      ]);
      expect(workTypeFilter.options.map(option => option.selected)).toEqual([
        false,
        false,
        true,
      ]);
      expect(languageFilter.options.map(option => option.label)).toEqual([
        'Welsh',
        'Norwegian',
      ]);
      expect(languageFilter.options.map(option => option.selected)).toEqual([
        true,
        true,
      ]);
    });
  });

  it('includes empty buckets on images license filter', () => {
    const filter = imagesFilters({
      images: imagesAggregations,
      props: fromImagesQuery({
        'locations.license': '"Non existent"',
      }),
    }).find(f => f.id === 'locations.license') as CheckboxFilter<
      keyof ImagesProps
    >;

    expect(filter.options.length).toBe(7);
  });

  function worksAggregationsWith(aggregationName, bucketList) {
    return {
      aggregations: {
        workType: { buckets: [] },
        availabilities: { buckets: [] },
        [aggregationName]: { buckets: bucketList },
      },
    };
  }
});
