import { useEffect, useState } from 'react';

import { convertIiifImageUri } from '@weco/common/utils/convert-image-uri';
import { getImages } from '@weco/content/services/wellcome/catalogue/images';
import type { Concept } from '@weco/content/services/wellcome/catalogue/types';
import { queryParams } from '@weco/content/utils/concepts';

/**
 * If the optional posterImage property is not present on the concept,
 * fetch up to 4 images related to the concept.
 * If posterImage is present, it will be used as the only image.
 */
// TODO need to discuss with David to make sure it is doing what is needed
export function useConceptImageUrls(concept: Concept) {
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  useEffect(() => {
    let isMounted = true;
    async function fetchImages() {
      if (concept.posterImage) {
        if (isMounted) setImageUrls([concept.posterImage]);
        return;
      }
      let urls: string[] = [];
      const params = queryParams('imagesAbout', concept); // or imagesOf or both or something else?
      const result = await getImages({ params, toggles: {}, pageSize: 4 });
      if ('results' in result && result.results.length > 0) {
        const fetchedUrls = result.results
          .map(img => {
            const thumbUrl = img.thumbnail?.url;
            if (thumbUrl) {
              return thumbUrl.includes('/info.json')
                ? convertIiifImageUri(thumbUrl, 400)
                : thumbUrl;
            }
            return undefined;
          })
          .filter(Boolean) as string[];
        urls = fetchedUrls.slice(0, 4);
      }
      if (isMounted) {
        setImageUrls(urls);
      }
    }
    fetchImages();
    return () => {
      isMounted = false;
    };
  }, [concept.id, concept.posterImage]);

  return imageUrls;
}
