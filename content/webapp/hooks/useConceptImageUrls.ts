import { useEffect, useState } from 'react';

import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import type {
  Concept,
  Image,
} from '@weco/content/services/wellcome/catalogue/types';
import { queryParams } from '@weco/content/utils/concepts';

/**
 * If the optional posterImage property is not present on the concept,
 * fetch up to 4 images related to the concept.
 * If posterImage is present, it will be used as the only image.
 */

const imagesCache: Map<string, Image[]> = new Map();

export function useConceptImageUrls(
  concept: Concept
): [Image?, Image?, Image?, Image?] {
  const [images, setImages] = useState<Image[]>([]);

  const cacheKey = concept.id;

  useEffect(() => {
    let isMounted = true;

    // If we've already fetched images for this concept, use the cached value
    const cached = imagesCache.get(cacheKey);
    if (cached) {
      setImages(cached);
      return;
    }

    async function fetchImages() {
      if (!isMounted) return;

      if (concept.posterImage) {
        const posterArr = [concept.posterImage];
        imagesCache.set(cacheKey, posterArr);
        setImages(posterArr);
        return;
      }

      let fetchedImages: Image[] = [];
      const params = queryParams('imagesAbout', concept); // or imagesOf or both or something else?
      try {
        const result = await getImages({ params, toggles: {}, pageSize: 4 });
        if ('results' in result && result.results.length > 0) {
          fetchedImages = result.results.slice(0, 4);
        }
        imagesCache.set(cacheKey, fetchedImages);
        if (isMounted) setImages(fetchedImages);
      } catch (error) {
        console.error('Failed to fetch concept images:', error);
        imagesCache.set(cacheKey, []);
        if (isMounted) setImages([]);
      }
    }

    fetchImages();
    return () => {
      isMounted = false;
    };
  }, [cacheKey, concept.posterImage]);

  return [images[0], images[1], images[2], images[3]] as [
    Image?,
    Image?,
    Image?,
    Image?,
  ];
}
