import { WellcomeAggregation } from '@weco/content/services/wellcome';
import { Toggles } from '@weco/toggles';

import { catalogueQuery } from '.';
import { WorkAggregations } from './types/aggregations';

export type WorkTypeStats = {
  id: string;
  label: string;
  count: number | null;
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
    },
    images: { id: 'images', label: 'Images', count: null },
    archivesAndManuscripts: {
      id: 'archives-manuscripts',
      label: 'Archives and manuscripts',
      count: null,
    },
    audioAndVideo: { id: 'audio-video', label: 'Audio and video', count: null },
    ephemera: { id: 'ephemera', label: 'Ephemera', count: null },
  };
}

/**
 * Transforms workType aggregations from the catalogue API into grouped collection statistics
 */
export function transformWorkTypeAggregations(
  workTypeAggregation: WellcomeAggregation,
  collectionStats: CollectionStats
): CollectionStats {
  // Initialize counts to 0 for aggregation (we're processing real data)
  collectionStats.booksAndJournals.count = 0;
  collectionStats.archivesAndManuscripts.count = 0;
  collectionStats.audioAndVideo.count = 0;
  collectionStats.ephemera.count = 0;
  collectionStats.images.count = 0;

  // Sum up counts for each category
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
      console.error(
        'Failed to fetch work type aggregations:',
        result.description
      );
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

export async function fetchImagesCount(toggles: Toggles = {}): Promise<number> {
  const fallbackCount = 120000; // Fallback estimate if API fails
  try {
    const result = await catalogueQuery('images', {
      toggles,
      pageSize: 1,
      params: {},
    });

    if ('type' in result && result.type === 'Error') {
      console.error('Failed to fetch images count:', result.description);
      return fallbackCount;
    }

    return result.totalResults || fallbackCount;
  } catch (error) {
    console.error('Error fetching images count:', error);
    return fallbackCount;
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
      console.error(
        'Failed to fetch work type aggregations, using default counts'
      );
    }

    // Only update images count if works data is available
    // It would be odd to show just the images count
    if (worksResult.status === 'fulfilled' && worksResult.value !== null) {
      // Works succeeded, so show images count (fetchImagesCount already handles fallback)
      if (imagesResult.status === 'fulfilled') {
        collectionStats.images.count = imagesResult.value;
      }
    }
    // If works failed, images.count stays null (no number displayed)

    return collectionStats;
  } catch (error) {
    console.error('Error fetching collection statistics:', error);
    // If error occurs, show labels with no counts
    return collectionStats;
  }
}
