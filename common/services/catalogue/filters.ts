import { CatalogueResultsList, Work, Image } from 'model/catalogue';
import { quoteVal } from '../../utils/csv';
import { toHtmlId } from '../../utils/string';
import { ImagesProps } from 'views/components/ImagesLink/ImagesLink';
import { WorksProps } from 'views/components/WorksLink/WorksLink';

export type DateRangeFilter = {
  type: 'dateRange';
  id: string;
  label: string;
  to: {
    key: keyof WorksProps;
    id: string;
    value: string | undefined;
  };
  from: {
    key: keyof WorksProps;
    id: string;
    value: string | undefined;
  };
};

export type CheckboxFilter = {
  type: 'checkbox';
  key: keyof WorksProps;
  id: string;
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
  key: keyof ImagesProps;
  id: string;
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
    key: 'productionDatesFrom',
    id: 'production.dates.from',
    value: props.productionDatesFrom,
  },
  to: {
    key: 'productionDatesTo',
    id: 'production.dates.to',
    value: props.productionDatesTo,
  },
});

const workTypeFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  key: 'workType',
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
  key: 'subjectsLabel',
  id: 'subjects.label',
  label: 'Subjects',
  options:
    works?.aggregations?.subjects?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props.subjectsLabel.includes(bucket.data.label),
    })) || [],
});

const genresFilter = ({ works, props }: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  key: 'genresLabel',
  id: 'genres.label',
  label: 'Genres',
  options:
    works?.aggregations?.genres?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.label),
      value: quoteVal(bucket.data.label),
      count: bucket.count,
      label: bucket.data.label,
      selected: props.genresLabel.includes(bucket.data.label),
    })) || [],
});

const contributorsFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  key: 'contributorsAgentLabel',
  id: 'contributors.agent.label',
  label: 'Contributors',
  options:
    works?.aggregations?.contributors?.buckets.map(bucket => ({
      id: toHtmlId(bucket.data.agent.label),
      value: quoteVal(bucket.data.agent.label),
      count: bucket.count,
      label: bucket.data.agent.label,
      selected: props.contributorsAgentLabel.includes(bucket.data.agent.label),
    })) || [],
});

const languagesFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  key: 'languages',
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

const locationsFilter = ({
  works,
  props,
}: WorksFilterProps): CheckboxFilter => ({
  type: 'checkbox',
  key: 'itemsLocationsType',
  id: 'items.locations.type',
  label: 'Locations',
  options:
    works?.aggregations?.locationType?.buckets.map(bucket => ({
      id: bucket.data.type,
      value: bucket.data.type,
      count: bucket.count,
      label: bucket.data.label,
      selected: props.itemsLocationsType.includes(bucket.data.type),
    })) || [],
});

const colorFilter = ({ props }: ImagesFilterProps): ColorFilter => ({
  type: 'color',
  key: 'color',
  id: 'color',
  label: 'Colours',
  color: props.color,
});

const imagesFilters: (props: ImagesFilterProps) => Filter[] = props =>
  [colorFilter].map(f => f(props));

const worksFilters: (props: WorksFilterProps) => Filter[] = props =>
  [
    productionDatesFilter,
    workTypeFilter,
    locationsFilter,
    contributorsFilter,
    subjectsFilter,
    genresFilter,
    languagesFilter,
  ].map(f => f(props));

export { worksFilters, imagesFilters };
