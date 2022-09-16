import { palette } from '../../views/components/PaletteColorPicker/PaletteColorPicker';
import { CatalogueResultsList, Work, Image } from '../../model/catalogue';
import { quoteVal } from '../../utils/csv';
import { toHtmlId } from '../../utils/string';
import { ImagesProps } from '../../views/components/ImagesLink/ImagesLink';
import { WorksProps } from '../../views/components/WorksLink/WorksLink';
import { isNotUndefined } from '../../utils/array';
import { isString } from 'lodash';

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
  excludeFromMoreFilters?: boolean;
};

export type CheckboxFilter = {
  type: 'checkbox';
  id: keyof WorksProps | keyof ImagesProps;
  label: string;
  showEmptyBuckets?: boolean;
  options: FilterOption[];
  // Most filters are to be included in the More Filters Modal,
  // so this only needs to be set to true in the rare case we
  // wish to exclude it.
  excludeFromMoreFilters?: boolean;
};

export type ColorFilter = {
  type: 'color';
  id: keyof ImagesProps;
  label: string;
  color: string | undefined;
  excludeFromMoreFilters?: boolean;
};

export type Filter = CheckboxFilter | DateRangeFilter | ColorFilter;

type Value = {
  value: string;
  label: string;
};

type FilterOption = Value & {
  id: string;
  count: number;
  selected: boolean;
};

function filterOptionsWithNonAggregates({
  options = [],
  values,
  showEmptyBuckets = false,
}: {
  options?: FilterOption[];
  values: Value[] | string[];
  showEmptyBuckets?: boolean;
}) {
  const selectedValues: Value[] = values.map(v =>
    isString(v) ? { label: v, value: v } : v
  );

  // We can get filter options from two places:
  //
  //    - The list of aggregations on the catalogue API response
  //    - A specific filter applied by the user
  //
  // In the latter case, suppose a user clicks through to a filtered search
  // from a work page.  We need to include the filter they clicked on in the
  // list of filters (so they can see/cancel it), but if it's an uncommon value
  // it may not be in the API aggregations.  We need to add it manually.
  const aggregationValues = options.map(option => option.value);
  const nonAggregateOptions = selectedValues
    .filter(({ value }) => !aggregationValues.includes(value))
    .map(({ label, value }) => ({
      id: toHtmlId(label),
      value,
      count: 0,
      label,
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
  options: filterOptionsWithNonAggregates({
    options: works?.aggregations?.workType.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.workType.includes(bucket.data.id),
    })),
    values: props.workType,
  }),
});

const subjectsFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'subjects.label',
  label: 'Subjects',
  options: filterOptionsWithNonAggregates({
    options: works?.aggregations?.['subjects.label']?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props['subjects.label'].includes(bucket.data.label),
    })),
    values: props['subjects.label'].map(label => ({
      label,
      value: quoteVal(label),
    })),
  }),
});

const genresFilter = ({ works, props }: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'genres.label',
  label: 'Types/Techniques',
  options: filterOptionsWithNonAggregates({
    options: works?.aggregations?.['genres.label']?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props['genres.label'].includes(bucket.data.label),
    })),
    values: props['genres.label'].map(label => ({
      label,
      value: quoteVal(label),
    })),
  }),
});

const contributorsAgentFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => {
  return {
    type: 'checkbox',
    id: 'contributors.agent.label',
    label: 'Contributors',
    options: filterOptionsWithNonAggregates({
      options: works?.aggregations?.['contributors.agent.label']?.buckets.map(
        bucket => ({
          id: toHtmlId(bucket.data.label),
          value: quoteVal(bucket.data.label),
          count: bucket.count,
          label: bucket.data.label,
          selected: props['contributors.agent.label'].includes(
            bucket.data.label
          ),
        })
      ),
      values: props['contributors.agent.label'].map(label => ({
        label,
        value: quoteVal(label),
      })),
    }),
  };
};

const languagesFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'languages',
  label: 'Languages',
  options: filterOptionsWithNonAggregates({
    options: works?.aggregations?.languages?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.languages.includes(bucket.data.id),
    })),
    values: props.languages,
  }),
});

/*
partOf is not a "real" filter, based on aggregations
in the same way that the other filters in this file are.

It exists here to support its inclusion in the ResetActiveFilters
section when a Series tag-style link takes the user to a search
page.

Because of this, it only requires the one filter option, generated
directly from the selected partOf value, rather than fetching
an aggregation of all partOfs via the API.
*/
const partOfFilter = ({ props }: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'partOf.title',
  label: 'Series',
  excludeFromMoreFilters: true,
  options: props['partOf.title']
    ? filterOptionsWithNonAggregates({
        options: [
          {
            id: props['partOf.title'],
            value: props['partOf.title'],
            label: props['partOf.title'],
            count: 0,
            selected: !!props['partOf.title'],
          },
        ],
        values: [props['partOf.title']],
      })
    : [],
});

const availabilitiesFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'availabilities',
  label: 'Locations',
  options: filterOptionsWithNonAggregates({
    options: works?.aggregations?.availabilities?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.availabilities.includes(bucket.data.id),
    })),
    values: props.availabilities,
  }),
});

const colorFilter = ({ props }: ImagesFilterProps): ColorFilter => {
  // In the color filter UI, users can:
  //
  //    - pick a named, pre-selected color (e.g. green, violet, red)
  //    - select an arbitrary color using a hue slider
  //
  // We want to make sure the filter is labelled to match what they
  // selected in the UI, so we:
  //
  //    - use our name if it's one of the pre-selected colors
  //    - use the hex string from the hue slider UI if it's an arbitrary color
  //
  // Note that the filter popover uses uppercase hex strings (e.g. #2E2EE6),
  // so we make sure the label matches.
  const paletteColor = palette.find(({ hexValue }) => hexValue === props.color);

  const label = isNotUndefined(paletteColor)
    ? paletteColor.colorName
    : `#${props.color?.toUpperCase()}`;

  return {
    type: 'color',
    id: 'color',
    label,
    color: props.color,
  };
};

// We want to customise the license labels for our UI as the API
// ones are, whilst correct, very verbose
// https://github.com/wellcomecollection/wellcomecollection.org/issues/6188
const licenseLabels = {
  'cc-by': 'Creative Commons CC-BY',
  'cc-by-nc': 'Creative Commons CC-BY-NC',
  'cc-by-nc-nd': 'Creative Commons CC-BY-NC-ND',
  'cc-0': 'Creative Commons CC0',
  'cc-by-nd': 'Creative Commons CC-BY-ND',
  'cc-by-sa': 'Creative Commons CC-BY-SA',
  'cc-by-nc-sa': 'Creative Commons CC-BY-NC-SA',
  pdm: 'Public Domain Mark',
  ogl: 'Open Government License',
  opl: 'Open Parliament License',
  inc: 'In copyright',
};

const licensesFilter = ({
  images,
  props,
}: ImagesFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'locations.license',
  label: 'Licenses',
  options: filterOptionsWithNonAggregates({
    options: images.aggregations?.license?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: licenseLabels[bucket.data.id] || bucket.data.label,
      selected: props['locations.license'].includes(bucket.data.id),
    })),
    values: props['locations.license'],
    showEmptyBuckets: true,
  }),
});

const sourceGenresFilter = ({
  images,
  props,
}: ImagesFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'source.genres.label',
  label: 'Types/Techniques',
  options: filterOptionsWithNonAggregates({
    options: images?.aggregations?.['source.genres.label']?.buckets.map(
      bucket => ({
        id: toHtmlId(bucket.data.label),
        value: quoteVal(bucket.data.label),
        count: bucket.count,
        label: bucket.data.label,
        selected: props['source.genres.label'].includes(bucket.data.label),
      })
    ),
    values: props['source.genres.label'].map(label => ({
      label,
      value: quoteVal(label),
    })),
  }),
});

const sourceSubjectsFilter = ({
  images,
  props,
}: ImagesFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'source.subjects.label',
  label: 'Subjects',
  options: filterOptionsWithNonAggregates({
    options: images?.aggregations?.['source.subjects.label']?.buckets.map(
      bucket => ({
        id: toHtmlId(bucket.data.label),
        value: quoteVal(bucket.data.label),
        count: bucket.count,
        label: bucket.data.label,
        selected: props['source.subjects.label'].includes(bucket.data.label),
      })
    ),
    values: props['source.subjects.label'].map(label => ({
      label,
      value: quoteVal(label),
    })),
  }),
});

const sourceContributorAgentsFilter = ({
  images,
  props,
}: ImagesFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'source.contributors.agent.label',
  label: 'Contributors',
  options: filterOptionsWithNonAggregates({
    options: images?.aggregations?.[
      'source.contributors.agent.label'
    ]?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props['source.contributors.agent.label'].includes(
        bucket.data.label
      ),
    })),
    values: props['source.contributors.agent.label'].map(label => ({
      label,
      value: quoteVal(label),
    })),
  }),
});

const imagesFilters: (props: ImagesFilterProps) => Filter[] = props =>
  [
    colorFilter,
    licensesFilter,
    sourceGenresFilter,
    sourceSubjectsFilter,
    sourceContributorAgentsFilter,
  ].map(f => f(props));

const worksFilters: (props: WorksFilterProps) => Filter[] = props =>
  [
    workTypeFilter,
    productionDatesFilter,
    availabilitiesFilter,
    subjectsFilter,
    genresFilter,
    contributorsAgentFilter,
    languagesFilter,
    partOfFilter,
  ].map(f => f(props));

export { worksFilters, imagesFilters };
