import { useEffect, useState } from 'react';

import {
  CollectionStats,
  createDefaultCollectionStats,
  fetchCollectionStats,
} from '@weco/content/services/wellcome/catalogue/workTypeAggregations';

export type UseCollectionStatsReturn = {
  data: CollectionStats;
  loading: boolean;
  error: string | null;
};

/**
 * Provides collection stats from work type aggregations and images
 */
export function useCollectionStats(): UseCollectionStatsReturn {
  const [data, setData] = useState<CollectionStats>(
    createDefaultCollectionStats()
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        setLoading(true);
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
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();

    return () => {
      isMounted = false;
    };
  }, []);

  return { data, loading, error };
}
