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
export function useConceptImageUrls(concept: Concept): Image[] {
  const [images, setImages] = useState<Image[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchImages() {
      if (isMounted) {
        if (concept.posterImage) {
          setImages([concept.posterImage]);
          return;
        }
        let fetchedImages: Image[] = [];
        const params = queryParams('imagesAbout', concept); // or imagesOf or both or something else?
        try {
          const result = await getImages({ params, toggles: {}, pageSize: 4 });
          if ('results' in result && result.results.length > 0) {
            fetchedImages = result.results.slice(0, 4);
          }
          setImages(fetchedImages);
        } catch (error) {
          console.error('Failed to fetch concept images:', error);
          setImages([]);
        }
      }
    }
    fetchImages();
    return () => {
      isMounted = false;
    };
  }, [concept.id, concept.posterImage]);

  return images;
}
