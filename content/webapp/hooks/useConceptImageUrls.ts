import { useEffect, useState } from 'react';

import {
  convertImageUri,
  iiifImageTemplate,
} from '@weco/common/utils/convert-image-uri';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import type { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { queryParams } from '@weco/content/utils/concepts';

/**
 * If the optional displayImages property is not present on the concept,
 * fetch up to 4 images related to the concept.
 */

const imagesCache: Map<string, string[]> = new Map();

export type ConceptImagesArray = [string?, string?, string?, string?];

export function useConceptImageUrls(concept: Concept): ConceptImagesArray {
  const [images, setImages] = useState<string[]>([]);

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

      if (concept.displayImages.length > 0) {
        const transformedImages = await Promise.all(
          concept.displayImages.map(async location =>
            iiifImageTemplate(location.url)({
              size: concept.displayImages.length === 1 ? '500,' : '250,',
            })
          )
        );
        imagesCache.set(cacheKey, transformedImages);
        setImages(transformedImages);
        return;
      }

      let fetchedImages: string[] = [];
      const params = queryParams('imagesAbout', concept);
      try {
        const result = await getImages({ params, toggles: {}, pageSize: 4 });
        if ('results' in result && result.results.length > 0) {
          fetchedImages = result.results
            .slice(0, 4)
            .map(image =>
              convertImageUri(
                image.locations[0].url,
                result.results.length === 1 ? 500 : 250
              )
            );
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
  }, [cacheKey, concept.displayImages]);

  return [images[0], images[1], images[2], images[3]] as ConceptImagesArray;
}
