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
  options: {
    id: string;
    value: string;
    count: number;
    label: string;
    selected: boolean;
  }[];
};

export type ColorFilter = {
  type: 'color';
  id: keyof ImagesProps;
  label: string;
  color: string | undefined;
};

export type Filter = CheckboxFilter | DateRangeFilter | ColorFilter;

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
  options:
    works?.aggregations?.workType.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.workType.includes(bucket.data.id),
    })) || [],
});

const subjectsFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'subjects.label',
  label: 'Subjects',
  options:
    works?.aggregations?.subjects?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props['subjects.label'].includes(bucket.data.label),
    })) || [],
});

const genresFilter = ({ works, props }: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'genres.label',
  label: 'Genres',
  options:
    works?.aggregations?.genres?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props['genres.label'].includes(bucket.data.label),
    })) || [],
});

const contributorsFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'contributors.agent.label',
  label: 'Contributors',
  options:
    works?.aggregations?.contributors?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.agent.label),
      value: quoteVal(bucket.data.agent.label),
      count: bucket.count,
      label: bucket.data.agent.label,
      selected: props['contributors.agent.label'].includes(
        bucket.data.agent.label
      ),
    })) || [],
});

const languagesFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'languages',
  label: 'Languages',
  options:
    works?.aggregations?.languages?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.languages.includes(bucket.data.id),
    })) || [],
});

const availabilitiesFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  id: 'availabilities',
  label: 'Locations',
  options:
    works?.aggregations?.availabilities?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.availabilities.includes(bucket.data.id),
    })) || [],
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
  options:
    images.aggregations?.license?.buckets.map(bucket => ({
      id: bucket.data.id,
      value: bucket.data.id,
      count: bucket.count,
      label: bucket.data.label,
      selected: props['locations.license'].includes(bucket.data.id),
    })) || [],
});

const imagesFilters: (props: ImagesFilterProps) => Filter[] = props =>
  [colorFilter, licenseFilter].map(f => f(props));

const worksFilters: (props: WorksFilterProps) => Filter[] = props =>
  [
    productionDatesFilter,
    workTypeFilter,
    availabilitiesFilter,
    contributorsFilter,
    subjectsFilter,
    genresFilter,
    languagesFilter,
  ].map(f => f(props));

export { worksFilters, imagesFilters };
