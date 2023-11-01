import worksAggregations from './fixtures/works-aggregations';
import imagesAggregations from './fixtures/images-aggregations';
import { CheckboxFilter, imagesFilters, worksFilters } from './filters';
import { fromQuery as fromWorksQuery } from '@weco/content/components/WorksLink';
import {
  fromQuery as fromImagesQuery,
  ImagesProps,
} from '@weco/content/components/ImagesLink';

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

  it('includes option to from query that is not in the API aggregation', () => {
    const filter = worksFilters({
      works: worksAggregations,
      props: fromWorksQuery({
        // An aggregation we know isn't in the fixture response
        'contributors.agent.label': '"Non existent"',
      }),
    }).find(f => f.id === 'contributors.agent.label') as CheckboxFilter;

    expect(
      filter.options.find(option => option.label === 'Non existent')
    ).toBeTruthy();
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

  it('filters duplicate labels from the aggregation buckets', () =>  {
    const aggregations =  {aggregations: {
      'subjects.label': {
      buckets: [
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
        }]}}};

    const filter = worksFilters({
      works: worksAggregations,
      props: {},
    }).find(f => f.id === 'subjects.label') as CheckboxFilter;

    expect(filter.options.length).toBe(2);
  })
});
