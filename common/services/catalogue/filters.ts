import { CatalogueResultsList, Work, Image } from '../../model/catalogue';
import { quoteVal } from '../../utils/csv';
import { toHtmlId } from '../../utils/string';
import { ImagesProps } from '../../views/components/ImagesLink/ImagesLink';
import { WorksProps } from '../../views/components/WorksLink/WorksLink';

export type DateRangeFilter = {
  type: 'dateRange';
  id: string;
  label: string;
  to: {
    id: keyof WorksProps;
    value: string | undefined;
  };
  from: {
    id: keyof WorksProps;
    value: string | undefined;
  };
};

export type CheckboxFilter = {
  type: 'checkbox';
  id: keyof WorksProps | keyof ImagesProps;
  label: string;
  showEmptyBuckets?: boolean;
  options: FilterOption[];
};

export type ColorFilter = {
  type: 'color';
  id: keyof ImagesProps;
  label: string;
  color: string | undefined;
};

export type Filter = CheckboxFilter | DateRangeFilter | ColorFilter;

type FilterOption = {
  id: string;
  value: string;
  count: number;
  label: string;
  selected: boolean;
};

function filterOptionsWithNonAggregates(
  options: FilterOption[],
  values: string[],
  showEmptyBuckets = false
) {
  const aggregationValues = options.map(option => option.value);
  const nonAggregateOptions = values
    .filter(value => !aggregationValues.includes(value))
    .map(label => ({
      id: toHtmlId(label),
      value: label,
      count: 0,
      label: label,
      selected: true,
    }));

  return nonAggregateOptions
    .concat(options)
    .filter(option => showEmptyBuckets || option.count > 0 || option.selected);
}

type WorksFilterProps = {
  works: CatalogueResultsList<Work>;
  props: WorksProps;
};

type ImagesFilterProps = {
  images: CatalogueResultsList<Image>;
  props: ImagesProps;
};

const productionDatesFilter = ({
  props,
}: WorksFilterProps): DateRangeFilter => ({
  type: 'dateRange',
  id: 'production.dates',
  label: 'Dates',
  from: {
    id: 'production.dates.from',
    value: props['production.dates.from'],
  },
  to: {
    id: 'production.dates.to',
    value: props['production.dates.to'],
  },
});

const workTypeFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'workType',
  label: 'Formats',
  options: filterOptionsWithNonAggregates(
    works?.aggregations?.workType.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.workType.includes(bucket.data.id),
    })) || [],
    props.workType
  ),
});

const subjectsFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'subjects.label',
  label: 'Subjects',
  options: filterOptionsWithNonAggregates(
    works?.aggregations?.subjects?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props['subjects.label'].includes(bucket.data.label),
    })) || [],
    props['subjects.label'].map(quoteVal)
  ),
});

const genresFilter = ({ works, props }: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'genres.label',
  label: 'Genres',
  options: filterOptionsWithNonAggregates(
    works?.aggregations?.genres?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props['genres.label'].includes(bucket.data.label),
    })) || [],
    props['genres.label'].map(quoteVal)
  ),
});

const contributorsFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => {
  return {
    type: 'checkbox',
    id: 'contributors.agent.label',
    label: 'Contributors',
    options: filterOptionsWithNonAggregates(
      works?.aggregations?.contributors?.buckets.map(bucket => ({
        id: toHtmlId(bucket.data.agent.label),
        value: quoteVal(bucket.data.agent.label),
        count: bucket.count,
        label: bucket.data.agent.label,
        selected: props['contributors.agent.label'].includes(
          bucket.data.agent.label
        ),
      })) || [],
      props['contributors.agent.label'].map(quoteVal)
    ),
  };
};

const languagesFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'languages',
  label: 'Languages',
  options: filterOptionsWithNonAggregates(
    works?.aggregations?.languages?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.languages.includes(bucket.data.id),
    })) || [],
    props.languages
  ),
});

const availabilitiesFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'availabilities',
  label: 'Locations',
  options: filterOptionsWithNonAggregates(
    works?.aggregations?.availabilities?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.availabilities.includes(bucket.data.id),
    })) || [],
    props.availabilities
  ),
});

const colorFilter = ({ props }: ImagesFilterProps): ColorFilter => ({
  type: 'color',
  id: 'color',
  label: 'Colours',
  color: props.color,
});

const licenseFilter = ({
  images,
  props,
}: ImagesFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'locations.license',
  label: 'License',
  options: filterOptionsWithNonAggregates(
    images.aggregations?.license?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props['locations.license'].includes(bucket.data.id),
    })) || [],
    props['locations.license'],
    true
  ),
});

const sourceGenresFilter = ({
  images,
  props,
}: ImagesFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'source.genres.label',
  label: 'Genres',
  options: filterOptionsWithNonAggregates(
    images?.aggregations?.['source.genres.label']?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props['source.genres.label'].includes(bucket.data.label),
    })) || [],
    props['source.genres.label'].map(quoteVal)
  ),
});

const sourceContributorAgentsFilter = ({
  images,
  props,
}: ImagesFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'source.contributors.agent.label',
  label: 'Contributors',
  options: filterOptionsWithNonAggregates(
    images?.aggregations?.['source.contributors.agent.label']?.buckets.map(
      bucket => ({
        id: toHtmlId(bucket.data.label),
        value: quoteVal(bucket.data.label),
        count: bucket.count,
        label: bucket.data.label,
        selected: props['source.contributors.agent.label'].includes(
          bucket.data.label
        ),
      })
    ) || [],
    props['source.contributors.agent.label'].map(quoteVal)
  ),
});

const imagesFilters: (props: ImagesFilterProps) => Filter[] = props =>
  [
    colorFilter,
    licenseFilter,
    sourceGenresFilter,
    sourceContributorAgentsFilter,
  ].map(f => f(props));

const worksFilters: (props: WorksFilterProps) => Filter[] = props =>
  [
    workTypeFilter,
    productionDatesFilter,
    availabilitiesFilter,
    subjectsFilter,
    genresFilter,
    contributorsFilter,
    languagesFilter,
  ].map(f => f(props));

export { worksFilters, imagesFilters };
