import { Dispatch, SetStateAction } from 'react';

import { toHtmlId } from '@weco/common/utils/grammar';
import { catalogueQuery } from '@weco/content/services/wellcome/catalogue';
import {
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

export const fetchRelated = async ({
  toggles,
  params,
  setRelated,
  work,
}: {
  toggles: Toggles;
  params: { [key: string]: string | string[] };
  setRelated: (results: WorkBasic[]) => void;
  work: Work;
}): Promise<void> => {
  const response = await catalogueQuery('works', {
    toggles,
    pageSize: 4, // In case we get the current work back, we will still have 3 to show
    params: {
      ...params,
      include: ['production', 'contributors'],
    },
  });

  if (response.type === 'ResultList') {
    setRelated(
      response.results
        .filter(result => result.id !== work.id)
        .slice(0, 3)
        .map(toWorkBasic)
    );
  }
};

// Returns a config object for tabs: one per subject label, date-range if possible, genres if available
export async function getRelatedTabConfig({
  work,
  relatedWorks,
  setRelatedWorks,
}: {
  work: Work;
  relatedWorks: { [key: string]: WorkBasic[] | undefined };
  setRelatedWorks: Dispatch<
    SetStateAction<{ [key: string]: WorkBasic[] | undefined }>
  >;
}) {
  const subjectLabels = work.subjects.map(subject => subject.label).slice(0, 3);
  const dateRange = getCenturyRange(work.production[0]?.dates[0]?.label);
  const typeTechniques = work.genres.map(genres => genres.label).slice(0, 3);

  const config: {
    [key: string]: {
      text: string;
      params: { [key: string]: string | string[] };
      related?: WorkBasic[];
      setRelated: (results: WorkBasic[]) => void;
    };
  } = {};

  subjectLabels.forEach(async label => {
    const id = toHtmlId(label);
    config[`subject-${id}`] = {
      text: label,
      params: { 'subjects.label': [`"${label}"`] },
      related: relatedWorks[`subject-${id}`],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks((prev: { [key: string]: WorkBasic[] | undefined }) => ({
          ...prev,
          [`subject-${id}`]: results,
        })),
    };
  });

  if (dateRange) {
    config['date-range'] = {
      text: dateRange.tabLabel,
      params: {
        'subjects.label': subjectLabels.map(label => `"${label}"`),
        'production.dates.from': dateRange.from,
        'production.dates.to': dateRange.to,
      },
      related: relatedWorks['date-range'],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks(prev => ({ ...prev, 'date-range': results })),
    };
  }

  typeTechniques.forEach(async label => {
    const id = toHtmlId(label);
    config[`type-${id}`] = {
      text: label,
      params: {
        'subjects.label': subjectLabels.map(label => `"${label}"`),
        'genres.label': [`"${label}"`],
      },
      related: relatedWorks[`type-${id}`],
      setRelated: (results: WorkBasic[]) =>
        setRelatedWorks((prev: { [key: string]: WorkBasic[] | undefined }) => ({
          ...prev,
          [`type-${id}`]: results,
        })),
    };
  });

  return config;
}
