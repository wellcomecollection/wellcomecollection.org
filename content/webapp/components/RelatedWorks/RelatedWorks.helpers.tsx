import { toHtmlId } from '@weco/common/utils/grammar';
import { WellcomeApiError } from '@weco/content/services/wellcome';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import {
  CatalogueResultsList,
  toWorkBasic,
  Work,
  WorkBasic,
} from '@weco/content/services/wellcome/catalogue/types';
import { Toggles } from '@weco/toggles';

// Returns the century range for a string containing exactly four digits
const getCenturyRange = (
  str?: string
): { tabLabel: string; from: string; to: string } | null => {
  const match = str?.match(/^(\d{4})$/);

  if (match) {
    const year = parseInt(match[0], 10);
    const centuryStart = Math.floor(year / 100) * 100;
    const centuryEnd = centuryStart + 99;

    return {
      tabLabel: `From ${centuryStart}s`,
      from: `${centuryStart}-01-01`,
      to: `${centuryEnd}-12-31`,
    };
  }
  return null;
};

export const fetchRelatedWorks = async ({
  work,
  toggles,
  setIsLoading,
}: {
  work: Work;
  toggles: Toggles;
  setIsLoading: (isLoading: boolean) => void;
}): Promise<{
  [key: string]: { label: string; results: WorkBasic[] };
}> => {
  setIsLoading(true);
  const results: {
    [key: string]: { label: string; results: WorkBasic[] };
  } = {};

  const subjectLabels = work.subjects.map(subject => subject.label).slice(0, 3);
  const typeTechniques = work.genres.map(genres => genres.label).slice(0, 3);
  const dateRange = getCenturyRange(work.production[0]?.dates[0]?.label);

  const catalogueBasicQuery = async (
    params
  ): Promise<WellcomeApiError | CatalogueResultsList<Work>> =>
    await catalogueQuery('works', {
      toggles,
      // Always fetch 4 works in case we get the current work back, then we will still have 3 to show.
      pageSize: 4,
      params: {
        include: ['production', 'contributors'], // This returns minimal data
        ...params,
      },
    });

  const addToResultsObject = (
    categoryLabel: string,
    tabLabel: string,
    response: WellcomeApiError | CatalogueResultsList<Work>
  ) => {
    if (response.type === 'ResultList') {
      // Filter out the current work from the results
      const filteredResults = response.results.filter(
        result => result.id !== work.id
      );
      if (filteredResults.length > 0) {
        results[`${categoryLabel}-${toHtmlId(tabLabel)}`] = {
          label: tabLabel,
          results: filteredResults.slice(0, 3).map(toWorkBasic),
        };
      }
    }
  };

  try {
    await Promise.all([
      ...subjectLabels.map(async label => {
        const response = await catalogueBasicQuery({
          'subjects.label': [`"${label}"`],
        });

        addToResultsObject('subject', label, response);
      }),

      ...(dateRange
        ? [
            (async () => {
              const response = await catalogueBasicQuery({
                'subjects.label': subjectLabels.map(
                  subjectLabel => `"${subjectLabel}"`
                ),
                'production.dates.from': dateRange.from,
                'production.dates.to': dateRange.to,
              });

              addToResultsObject('date-range', dateRange.tabLabel, response);
            })(),
          ]
        : []),

      ...typeTechniques.map(async label => {
        const response = await catalogueBasicQuery({
          'subjects.label': subjectLabels.map(
            subjectLabel => `"${subjectLabel}"`
          ),
          'genres.label': [`"${label}"`],
        });

        addToResultsObject('type', label, response);
      }),
    ]);
  } catch (error) {
    console.error('Error fetching related works:', error);
  }

  if (Object.keys(results).length === 0) {
    return undefined;
  }

  // Order object keys to ensure consistent order
  const orderedKeys = Object.keys(results).sort((a, b) => {
    const order = ['subject-', 'date-range', 'type-'];
    const aIndex = order.findIndex(prefix => a.startsWith(prefix));
    const bIndex = order.findIndex(prefix => b.startsWith(prefix));
    return aIndex - bIndex || a.localeCompare(b);
  });

  // Return ordered results
  const orderedResults: {
    [key: string]: { label: string; results: WorkBasic[] };
  } = {};
  orderedKeys.forEach(key => {
    orderedResults[key] = results[key];
  });

  return orderedResults;
};
