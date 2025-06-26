import { toHtmlId } from '@weco/common/utils/grammar';
import { WellcomeApiError } from '@weco/content/services/wellcome';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import {
  CatalogueResultsList,
  toWorkBasic,
  Work,
} from '@weco/content/services/wellcome/catalogue/types';
import { Toggles } from '@weco/toggles';

import { RelatedWork, WorkQueryProps } from '.';

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
  workId,
  subjects,
  typesTechniques,
  date,
  toggles,
  setIsLoading,
}: WorkQueryProps & {
  toggles: Toggles;
  setIsLoading: (isLoading: boolean) => void;
}): Promise<RelatedWork | undefined> => {
  setIsLoading(true);
  const results: RelatedWork = {};

  const subjectLabels = subjects.map(subject => subject.label).slice(0, 3);
  const typeTechniques = typesTechniques?.map(genre => genre.label).slice(0, 2);
  const dateRange = getCenturyRange(date);

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
        result => result.id !== workId
      );
      if (filteredResults.length > 0) {
        results[`${categoryLabel}-${toHtmlId(tabLabel)}`] = {
          label: tabLabel,
          category: categoryLabel,
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

              addToResultsObject('period', dateRange.tabLabel, response);
            })(),
          ]
        : []),

      ...(typeTechniques
        ? typeTechniques.map(async label => {
            const response = await catalogueBasicQuery({
              'subjects.label': subjectLabels.map(
                subjectLabel => `"${subjectLabel}"`
              ),
              'genres.label': [`"${label}"`],
            });

            addToResultsObject('genre', label, response);
          })
        : []),
    ]);
  } catch (error) {
    console.error('Error fetching related works:', error);
  }

  if (Object.keys(results).length === 0) {
    return undefined;
  }

  // Order object keys to ensure consistent order
  const orderedKeys = Object.keys(results).sort((a, b) => {
    const order = ['subject-', 'period-', 'genre-'];
    const aIndex = order.findIndex(prefix => a.startsWith(prefix));
    const bIndex = order.findIndex(prefix => b.startsWith(prefix));
    return aIndex - bIndex || a.localeCompare(b);
  });

  // Return ordered results
  const orderedResults: RelatedWork = {};
  orderedKeys.forEach(key => {
    orderedResults[key] = results[key];
  });

  return orderedResults;
};
