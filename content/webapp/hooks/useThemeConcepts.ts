import { useCallback, useState } from 'react';

import type { Concept } from '@weco/content/services/wellcome/catalogue/types';
import type { ThemeCategory } from '@weco/content/views/pages/collections/themeBlockCategories';

export function useThemeConcepts(
  initialConcepts: Concept[],
  getConceptsByIds: (ids: string[]) => Promise<Concept[]>
) {
  const [concepts, setConcepts] = useState<Concept[]>(initialConcepts);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchConcepts = useCallback(
    async (category: ThemeCategory) => {
      setLoading(true);
      setError(null);
      try {
        const result = await getConceptsByIds(category.concepts);
        setConcepts(result);
      } catch (err) {
        setError('Failed to load concepts');
      } finally {
        setLoading(false);
      }
    },
    [getConceptsByIds]
  );

  return { concepts, loading, error, fetchConcepts };
}
