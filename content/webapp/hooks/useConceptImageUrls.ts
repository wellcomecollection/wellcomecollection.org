import { useEffect, useState } from 'react';

import { useFeatureFlags, useModes } from '@weco/common/server-data/Context';
import {
  convertIiifImageUri,
  iiifImageTemplate,
} from '@weco/common/utils/convert-image-uri';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import type { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { queryParams } from '@weco/content/utils/concepts';

/**
 * If displayImages is empty,
 * fetch up to 4 images related to the concept.
 *
 * Fallback strategy by concept type:
 * - Person/Organisation/Agent: displayImages → imagesBy → topped up with imagesAbout
 * - Genre: displayImages → imagesIn (images of that type/technique) → topped up with imagesAbout
 * - All others: displayImages → imagesAbout
 */

const imagesCache: Map<string, string[]> = new Map();

export type ConceptImagesArray = [string?, string?, string?, string?];

async function fetchImagesBySection({
  sectionName,
  concept,
  limit,
  shouldUseStagingApi,
  pipelineCluster,
}: {
  sectionName: string;
  concept: Concept;
  limit: number;
  shouldUseStagingApi?: boolean;
  pipelineCluster?: string;
}): Promise<string[]> {
  const params = queryParams(sectionName, concept);
  const result = await getImages({
    params,
    shouldUseStagingApi,
    pipelineCluster,
    pageSize: limit,
  });
  if (!('results' in result) || result.results.length === 0) return [];
  return result.results
    .slice(0, limit)
    .map(image => convertIiifImageUri(image.locations[0].url, 250));
}

export function useConceptImageUrls(concept: Concept): ConceptImagesArray {
  const [images, setImages] = useState<string[]>([]);
  const { stagingApi } = useFeatureFlags();
  const { cataloguePipeline } = useModes();
  const pipelineCluster = cataloguePipeline ?? undefined;

  // Include the toggle state in the key so that changing the
  // cataloguePipeline mode mid-session doesn’t serve cached
  // image URLs from another pipeline
  const cacheKey = `${concept.id}:${pipelineCluster ?? 'default'}`;

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

      let fetchedImages: string[];

      const topUpWithAbout = async (images: string[]) => {
        if (images.length >= 4) return images;
        const aboutImages = await fetchImagesBySection({
          sectionName: 'imagesAbout',
          concept,
          limit: 4 - images.length,
          shouldUseStagingApi: stagingApi,
          pipelineCluster,
        });
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
            await fetchImagesBySection({
              sectionName: 'imagesBy',
              concept,
              limit: 4,
              shouldUseStagingApi: stagingApi,
              pipelineCluster,
            })
          );
        } else if (concept.type === 'Genre') {
          // Prioritise images of this type/technique (imagesIn), then top up with imagesAbout
          fetchedImages = await topUpWithAbout(
            await fetchImagesBySection({
              sectionName: 'imagesIn',
              concept,
              limit: 4,
              shouldUseStagingApi: stagingApi,
              pipelineCluster,
            })
          );
        } else {
          fetchedImages = await fetchImagesBySection({
            sectionName: 'imagesAbout',
            concept,
            limit: 4,
            shouldUseStagingApi: stagingApi,
            pipelineCluster,
          });
        }

        // Use a larger size when only one image is available, matching the single-image layout
        const sizedImages =
          fetchedImages.length === 1
            ? [convertIiifImageUri(fetchedImages[0], 500)]
            : fetchedImages;

        imagesCache.set(cacheKey, sizedImages);

        if (isMounted) setImages(sizedImages);
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
  }, [
    cacheKey,
    concept.displayImages,
    concept.type,
    stagingApi,
    pipelineCluster,
  ]);

  return [images[0], images[1], images[2], images[3]] as ConceptImagesArray;
}
