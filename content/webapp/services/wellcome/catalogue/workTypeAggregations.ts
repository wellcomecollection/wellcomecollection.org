import { WellcomeAggregation } from '@weco/content/services/wellcome';
import { Toggles } from '@weco/toggles';

import { catalogueQuery } from '.';
import { WorkAggregations } from './types/aggregations';

export type WorkTypeStats = {
  id: string;
  label: string;
  count: number | null;
  fallbackCount: number;
};

export type CollectionStats = {
  booksAndJournals: WorkTypeStats;
  images: WorkTypeStats;
  archivesAndManuscripts: WorkTypeStats;
  audioAndVideo: WorkTypeStats;
  ephemera: WorkTypeStats;
};

// Mapping catalogue work type IDs to grouped categories
const WORK_TYPE_MAPPINGS = {
  a: 'booksAndJournals', // Books
  d: 'booksAndJournals', // Journals

  h: 'archivesAndManuscripts', // Archives and manuscripts
  b: 'archivesAndManuscripts', // Manuscripts
  hdig: 'archivesAndManuscripts', // Born-digital archives

  g: 'audioAndVideo', // Videos
  i: 'audioAndVideo', // Audio
  n: 'audioAndVideo', // Film
  c: 'audioAndVideo', // Music

  l: 'ephemera', // Ephemera
} as const;

export function createDefaultCollectionStats(): CollectionStats {
  return {
    booksAndJournals: {
      id: 'books-journals',
      label: 'Books and Journals',
      count: null,
      fallbackCount: 550000,
    },
    images: {
      id: 'images',
      label: 'Images',
      count: null,
      fallbackCount: 120000,
    },
    archivesAndManuscripts: {
      id: 'archives-manuscripts',
      label: 'Archives and manuscripts',
      count: null,
      fallbackCount: 260000,
    },
    audioAndVideo: {
      id: 'audio-video',
      label: 'Audio and video',
      count: null,
      fallbackCount: 10000,
    },
    ephemera: {
      id: 'ephemera',
      label: 'Ephemera',
      count: null,
      fallbackCount: 20000,
    },
  };
}

// Transforms workType aggregations from the catalogue API into grouped collection statistics
export function transformWorkTypeAggregations(
  workTypeAggregation: WellcomeAggregation,
  collectionStats: CollectionStats
): CollectionStats {
  // Sum counts for each category
  // Note: images count is handled separately in fetchCollectionStats
  workTypeAggregation.buckets.forEach(bucket => {
    const workTypeId = bucket.data.id;
    const category =
      WORK_TYPE_MAPPINGS[workTypeId as keyof typeof WORK_TYPE_MAPPINGS];

    if (category) {
      const currentCount = collectionStats[category].count || 0;
      collectionStats[category].count = currentCount + bucket.count;
    }
  });

  return collectionStats;
}

export async function fetchWorksAggregations(
  toggles: Toggles = {}
): Promise<WellcomeAggregation | null> {
  try {
    const result = await catalogueQuery('works', {
      toggles,
      pageSize: 1,
      params: {
        aggregations: 'workType',
      },
    });

    if ('type' in result && result.type === 'Error') {
      console.error('Failed to fetch work type aggregations:', result);
      return null;
    }

    // Cast to works result since we know we're querying works with workType aggregation
    const worksResult = result as { aggregations?: WorkAggregations };
    if (!worksResult.aggregations?.workType) {
      console.error('No workType aggregations found in response');
      return null;
    }

    return worksResult.aggregations.workType;
  } catch (error) {
    console.error('Error fetching work type aggregations:', error);
    return null;
  }
}

export async function fetchImagesCount(
  toggles: Toggles = {}
): Promise<number | null> {
  try {
    const result = await catalogueQuery('images', {
      toggles,
      pageSize: 1,
      params: {},
    });

    if ('type' in result && result.type === 'Error') {
      console.error('Failed to fetch images count:', result);
      return null;
    }

    return result.totalResults || null;
  } catch (error) {
    console.error('Error fetching images count:', error);
    return null;
  }
}

export async function fetchCollectionStats(
  toggles: Toggles = {}
): Promise<CollectionStats> {
  const collectionStats = createDefaultCollectionStats();

  try {
    const [worksResult, imagesResult] = await Promise.allSettled([
      fetchWorksAggregations(toggles),
      fetchImagesCount(toggles),
    ]);

    if (worksResult.status === 'fulfilled' && worksResult.value !== null) {
      const worksAggregation = worksResult.value;
      transformWorkTypeAggregations(worksAggregation, collectionStats);
    } else {
      console.warn(
        'Failed to fetch work type aggregations, using fallback counts:',
        worksResult.status === 'rejected' ? worksResult.reason : 'null result'
      );
    }

    if (imagesResult.status === 'fulfilled' && imagesResult.value !== null) {
      collectionStats.images.count = imagesResult.value;
    } else {
      console.warn(
        'Failed to fetch images count, using fallback count:',
        imagesResult.status === 'rejected'
          ? imagesResult.reason
          : 'unknown error'
      );
    }
    return collectionStats;
  } catch (error) {
    console.error('Error fetching collection statistics:', error);
    return collectionStats;
  }
}
