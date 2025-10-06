import { useCallback, useState } from 'react';

import type { Concept } from '@weco/content/services/wellcome/catalogue/types';
import type { ThemeCategory } from '@weco/content/views/pages/collections/themeBlockCategories';

const conceptsCache: Map<string, Concept[]> = new Map();

export function useThemeConcepts(
  initialConcepts: Concept[],
  getConceptsByIds: (ids: string[]) => Promise<Concept[]>
) {
  const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConcepts = useCallback(
    async (category: ThemeCategory): Promise<Concept[]> => {
      // Return cached results if we have them.
      const cached = conceptsCache.get(category.label);
      if (cached) {
        setConcepts(cached);
        return cached;
      }

      setLoading(true);
      setError(null);
      try {
        const result = await getConceptsByIds(category.concepts);
        conceptsCache.set(category.label, result);
        setConcepts(result);
        return result;
      } catch (err) {
        setError('Failed to load concepts');
        return [];
      } finally {
        setLoading(false);
      }
    },
    [getConceptsByIds]
  );

  const setCache = useCallback((label: string, data: Concept[]) => {
    conceptsCache.set(label, data);
  }, []);

  return { concepts, loading, error, fetchConcepts, setCache };
}
