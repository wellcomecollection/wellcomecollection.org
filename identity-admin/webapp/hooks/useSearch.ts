import { useState, useEffect } from 'react';
import { SearchResults } from '../interfaces';
import { callMiddlewareApi } from '../utils/api-caller';
import { useRouter } from 'next/router';
import { buildSearchParams } from '../utils/search-util';

type UserSearchQuery = {
  data?: SearchResults;
  isLoading: boolean;
  error?: string;
};

export function useUserSearch(): UserSearchQuery {
  const router = useRouter();
  const { page, status, name, email, sort, sortDir } = router.query;
  const [data, setData] = useState<SearchResults>();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState();

  const fetchUser = async () => {
    setIsLoading(true);
    setError(undefined);

    const params = buildSearchParams(page, status, name, email, sort, sortDir);
    let endpoint = '/api/users';
    if (params.length > 0) {
      endpoint = endpoint + '?' + params.join('&');
    }
    await callMiddlewareApi<SearchResults>(endpoint)
      .then(searchResults => {
        setIsLoading(false);
        setData(searchResults);
      })
      .catch(fetchError => {
        setIsLoading(false);
        setError(fetchError.message);
      });
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return { data, isLoading, error };
}
