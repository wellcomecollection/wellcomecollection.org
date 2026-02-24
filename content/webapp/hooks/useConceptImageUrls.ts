import { useEffect, useState } from 'react';

import {
  convertIiifImageUri,
  iiifImageTemplate,
} from '@weco/common/utils/convert-image-uri';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import type { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { queryParams } from '@weco/content/utils/concepts';

/**
 * If the optional displayImages property is not present on the concept,
 * fetch up to 4 images related to the concept.
 *
 * Fallback strategy by concept type:
 * - Person/Organisation/Agent: displayImages → imagesBy → topped up with imagesAbout
 * - Genre: displayImages → imagesIn (images of that type/technique) → topped up with imagesAbout
 * - All others: displayImages → imagesAbout
 */

const imagesCache: Map<string, string[]> = new Map();

export type ConceptImagesArray = [string?, string?, string?, string?];

async function fetchImagesBySection(
  sectionName: string,
  concept: Concept,
  limit: number
): Promise<string[]> {
  const params = queryParams(sectionName, concept);
  const result = await getImages({ params, toggles: {}, pageSize: limit });
  if (!('results' in result) || result.results.length === 0) return [];
  return result.results
    .slice(0, limit)
    .map(image =>
      convertIiifImageUri(image.locations[0].url, limit === 1 ? 500 : 250)
    );
}

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

      const topUpWithAbout = async (images: string[]) => {
        if (images.length >= 4) return images;
        const aboutImages = await fetchImagesBySection(
          'imagesAbout',
          concept,
          4 - images.length
        );
        return [...images, ...aboutImages];
      };

      try {
        if (
          concept.type === 'Agent' ||
          concept.type === 'Person' ||
          concept.type === 'Organisation'
        ) {
          // Prioritise images by this person/organisation/agent, then top up with imagesAbout
          fetchedImages = await topUpWithAbout(
            await fetchImagesBySection('imagesBy', concept, 4)
          );
        } else if (concept.type === 'Genre') {
          // Prioritise images of this type/technique (imagesIn), then top up with imagesAbout
          fetchedImages = await topUpWithAbout(
            await fetchImagesBySection('imagesIn', concept, 4)
          );
        } else {
          fetchedImages = await fetchImagesBySection('imagesAbout', concept, 4);
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
  }, [cacheKey, concept.displayImages, concept.type]);

  return [images[0], images[1], images[2], images[3]] as ConceptImagesArray;
}
