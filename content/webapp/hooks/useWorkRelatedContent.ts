import { useContext, useState } from 'react';

import { useAbortSignalEffect } from '@weco/common/hooks/useAbortSignalEffect';
import { ServerDataContext } from '@weco/common/server-data/Context';
import { globalApiOptions, rootUris } from '@weco/content/services/wellcome';
import {
  Addressable,
  Article,
  ContentResultsList,
} from '@weco/content/services/wellcome/content/types/api';

type UseWorkRelatedContentState = 'initial' | 'loading' | 'success' | 'error';

type UseWorkRelatedContentReturn = {
  relatedContent: Addressable[];
  articles: Article[];
  totalResults: number;
  state: UseWorkRelatedContentState;
  error: string | null;
};

/**
 * Custom hook to fetch content that references a specific work
 */
export function useWorkRelatedContent(
  workId: string
): UseWorkRelatedContentReturn {
  const [relatedContent, setRelatedContent] = useState<Addressable[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [totalResults, setTotalResults] = useState(0);
  const [state, setState] = useState<UseWorkRelatedContentState>('initial');
  const [error, setError] = useState<string | null>(null);
  const serverData = useContext(ServerDataContext);

  useAbortSignalEffect(
    signal => {
      const fetchRelatedContent = async () => {
        if (!workId) return;

        setState('loading');
        setError(null);

        try {
          // Use direct external API call to Wellcome Content API
          const apiOptions = globalApiOptions(serverData.toggles);
          const url = `${rootUris[apiOptions.env.content]}/content/v0/all?linkedWork=${workId}`;
          const response = await fetch(url, {
            signal,
            credentials: 'include', // Include credentials for CORS
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data: ContentResultsList<Addressable | Article> = await response.json();

          if (!signal.aborted) {
            // Separate articles from other content types
            const allResults = data.results || [];
            const articleResults = allResults.filter(
              (item): item is Article =>
                item.type === 'Article' && 'publicationDate' in item
            );
            const otherResults = allResults.filter(
              (item): item is Addressable =>
                !(item.type === 'Article' && 'publicationDate' in item)
            );

            setArticles(articleResults);
            setRelatedContent(otherResults);
            setTotalResults(data.totalResults || 0);
            setState('success');
          }
        } catch (err) {
          if (!signal.aborted) {
            setError(
              err instanceof Error
                ? err.message
                : 'Failed to fetch related content'
            );
            setState('error');
          }
        }
      };

      fetchRelatedContent();
    },
    [workId, serverData.toggles]
  );

  return {
    relatedContent,
    articles,
    totalResults,
    state,
    error,
  };
}
