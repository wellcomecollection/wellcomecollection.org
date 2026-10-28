import { useEffect, useState } from 'react';

/**
 * The current URL's hash, without the `#`. Next's router changes the URL
 * without telling the browser, so it's read again when the router's path
 * changes, as well as when the browser changes the hash itself (e.g. a link to
 * `#something`). It's undefined on the first render, as the server never sees
 * the hash, so the server and browser render the same.
 */
const useUrlHash = (routerPath?: string): string | undefined => {
  const [hash, setHash] = useState<string | undefined>();

  useEffect(() => {
    const readHash = () => setHash(window.location.hash.slice(1) || undefined);

    readHash();
    window.addEventListener('hashchange', readHash);
    return () => window.removeEventListener('hashchange', readHash);
  }, [routerPath]);

  return hash;
};

export default useUrlHash;
