import { useLocation } from 'react-router-dom';
import { useMemo } from 'react';
import { parse, ParsedQuery } from 'query-string';

export function useLocationQuery<T extends ParsedQuery>(): T {
  const location = useLocation();
  return useMemo(() => {
    return parse(location.search) as T;
  }, [location]);
}
