import { Toggles } from '@weco/toggles';

import { catalogueQuery } from '.';
import { toWorkBasic, Work, WorkBasic } from './types';
import { WorkAggregations } from './types/aggregations';

export type GenreWithCount = {
  id: string;
  label: string;
  count: number;
};

/**
 * Fetch the top genres/types/techniques for a given workType
 * Returns the top 10 genres ordered by count
 */
export async function fetchTopGenresForWorkType(
  workType: string,
  toggles: Toggles = {}
): Promise<GenreWithCount[]> {
  try {
    const result = await catalogueQuery('works', {
      toggles,
      pageSize: 1,
      params: {
        workType,
        aggregations: 'genres.label',
      },
    });

    if ('type' in result && result.type === 'Error') {
      console.error('Failed to fetch genres aggregation:', result);
      return [];
    }

    const worksResult = result as { aggregations?: WorkAggregations };
    const genresAggregation = worksResult.aggregations?.['genres.label'];

    if (!genresAggregation) {
      console.error('No genres.label aggregations found in response');
      return [];
    }

    // Get top 10 genres by count
    return genresAggregation.buckets.slice(0, 10).map(bucket => {
      const genreLabel = bucket.data.label;
      // Ensure we're using strings, not objects
      return {
        id: typeof genreLabel === 'string' ? genreLabel : String(genreLabel),
        label: typeof genreLabel === 'string' ? genreLabel : String(genreLabel),
        count: bucket.count,
      };
    });
  } catch (error) {
    console.error('Error fetching genres for workType:', workType, error);
    return [];
  }
}

/**
 * Fetch works filtered by workType and genre
 * Returns the first `pageSize` works
 */
export async function fetchWorksByTypeAndGenre(
  workType: string,
  genre: string,
  pageSize: number = 10,
  toggles: Toggles = {}
): Promise<WorkBasic[]> {
  try {
    const result = await catalogueQuery('works', {
      toggles,
      pageSize,
      params: {
        workType,
        'genres.label': genre,
        include: ['production', 'contributors', 'images'],
      },
    });

    if ('type' in result && result.type === 'Error') {
      console.error('Failed to fetch works:', result);
      return [];
    }

    // Transform Work objects to WorkBasic
    const works = result.results || [];
    return works.map((work: Work) => toWorkBasic(work));
  } catch (error) {
    console.error('Error fetching works by type and genre:', error);
    return [];
  }
}
