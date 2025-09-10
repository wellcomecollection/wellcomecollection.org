import { useEffect, useState } from 'react';

import {
  CollectionStats,
  createDefaultCollectionStats,
  fetchCollectionStats,
} from '@weco/content/services/wellcome/catalogue/workTypeAggregations';

export type UseCollectionStatsReturn = {
  data: CollectionStats;
  error: string | null;
};

/**
 * Provides collection stats from work type aggregations and images
 * Shows fallback counts immediately, then updates with real data when available
 */
export function useCollectionStats(): UseCollectionStatsReturn {
  const [data, setData] = useState<CollectionStats>(
    createDefaultCollectionStats()
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setError(null);

        const stats = await fetchCollectionStats();

        if (isMounted) {
          setData(stats);
        }
      } catch (err) {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : 'An unknown error occurred while fetching collection statistics'
          );
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, error };
}
