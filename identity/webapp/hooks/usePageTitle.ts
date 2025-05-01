import { useEffect } from 'react';

export function usePageTitle(pageTitle: string): void {
  useEffect(() => {
    document.title = `${pageTitle} | Wellcome Collection`;
  }, [pageTitle]);
}
