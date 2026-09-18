import { Manifest } from '@iiif/presentation-3';
import { useEffect, useState } from 'react';

import { DigitalLocation } from '@weco/common/model/catalogue';
import { fetchIIIFPresentationManifest } from '@weco/content/services/iiif/fetch/manifest';
import { transformManifest } from '@weco/content/services/iiif/transformers/manifest';
import { TransformedManifest } from '@weco/content/types/manifest';

const manifestPromises: Map<string, Promise<Manifest | undefined>> = new Map();
const cachedTransformedManifest: Map<string, TransformedManifest> = new Map();

type UseManifestResult = {
  transformedManifest?: TransformedManifest;
  isLoading: boolean;
  error?: unknown;
};

const useManifest = (
  location?: DigitalLocation,
  workTypeId?: string
): UseManifestResult => {
  const [transformedManifest, setTransformedManifest] = useState<
    TransformedManifest | undefined
  >(location && cachedTransformedManifest.get(location.url));
  const [isLoading, setIsLoading] = useState(
    !!location && !cachedTransformedManifest.has(location.url)
  );
  const [error, setError] = useState<unknown>();

  useEffect(() => {
    let isMounted = true;

    async function fetchManifest(url: string) {
      const cached = cachedTransformedManifest.get(url);
      if (cached) {
        setTransformedManifest(cached);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const existingPromise = manifestPromises.get(url);
        const iiifManifest =
          existingPromise ||
          (() => {
            const promise = fetchIIIFPresentationManifest({
              location: url,
              workTypeId,
            }).catch(e => {
              // Don't let a failed fetch permanently poison the cache for
              // this url - a later render should be able to retry.
              manifestPromises.delete(url);
              throw e;
            });
            manifestPromises.set(url, promise);
            return promise;
          })();

        const manifest = await iiifManifest;
        if (!isMounted) return;

        if (manifest) {
          const transformed = transformManifest(manifest);
          cachedTransformedManifest.set(url, transformed);
          setTransformedManifest(transformed);
        }
      } catch (e) {
        if (isMounted) setError(e);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    // Reset to what we know synchronously for the new location (cached data,
    // or nothing) before kicking off any fetch - otherwise the previous
    // location's manifest/error would keep being returned while this one
    // loads, or indefinitely if there's no location at all.
    setError(undefined);
    setTransformedManifest(
      location && cachedTransformedManifest.get(location.url)
    );

    if (location) {
      fetchManifest(location.url);
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    };
  }, [location?.url, workTypeId]);

  return { transformedManifest, isLoading, error };
};

export default useManifest;
