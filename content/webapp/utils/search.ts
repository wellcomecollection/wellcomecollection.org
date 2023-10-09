import { isNotUndefined } from '@weco/common/utils/type-guards';
import { getColorDisplayName } from 'components/PaletteColorPicker';
import { Filter } from '@weco/content/services/wellcome/catalogue/filters';

// FILTERS
/**
 * Compare filter options to query parameters,
 * telling us if the user has applied any filters.
 * This is used for SearchNoResult's rendered copy
 * @param {string[]} filters - Available filter options
 * @param {string[]} queryParams - URL query parameters
 */
export const hasFilters = ({
  filters,
  queryParams,
}: {
  filters: string[];
  queryParams: string[];
}): boolean => {
  return !!filters.filter(element => queryParams.includes(element)).length;
};

/**
 * Gets the active filters' labels as they are needed for aria-live readings
 * @param {string[]} filters - Available filter options
 */
export const getActiveFiltersLabel = ({
  filters,
}: {
  filters: Filter[];
}): string[] => {
  return filters
    .map(f => {
      if (f.type === 'checkbox') {
        const activeOptions = f.options.filter(option => option.selected);
        return activeOptions.map(o => o.label);
      } else if (f.type === 'dateRange') {
        let dateRange = '';
        if (f.from.value) dateRange = `From ${f.from.value} `;
        if (f.to.value) dateRange = dateRange + `to up to ${f.to.value}`;
        return dateRange || undefined;
      } else if (f.type === 'color' && f.color) {
        return getColorDisplayName(f.color) || undefined;
      }
      return undefined;
    })
    .filter(isNotUndefined)
    .flat();
};
