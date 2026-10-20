import {
  Dispatch,
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { useFeatureFlags, useModes } from '@weco/common/server-data/Context';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

/**
 * Keeps the image open when only the page of results changes. The links to
 * other pages don't have the image's id in them, so without this, losing it
 * from the URL would close the image. A different query, sort or filter still
 * closes it.
 */
type Options = { keepOpenOnResultsChange?: boolean };

// The URL's query parameters other than the page number, to tell a new page of
// the same results from different results
const paramsExceptPageNumber = () => {
  const params = new URLSearchParams(window.location.search);
  params.delete('page');
  return params.toString();
};

const useExpandedImage = (
  images: Image[],
  { keepOpenOnResultsChange = false }: Options = {}
): [Image | undefined, Dispatch<SetStateAction<Image | undefined>>] => {
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  const { stagingApi } = useFeatureFlags();
  const { cataloguePipeline } = useModes();
  const hasBeenExpanded = useRef(false);
  const lastParams = useRef<string | undefined>(undefined);
  const expandedImageRef = useRef(expandedImage);
  expandedImageRef.current = expandedImage;

  const imageMap = useMemo<Record<string, Image>>(
    () => images.reduce((a, image) => ({ ...a, [image.id]: image }), {}),
    [images]
  );

  const setImageIdInURL = (id: string) => {
    window.location.hash = id;
  };

  useEffect(() => {
    const onHashChanged = async (event?: HashChangeEvent) => {
      // to trim the '#' symbol
      const hash = window.location.hash.slice(1);

      // No event means the results changed, not the hash
      const openImage = expandedImageRef.current;
      const params = paramsExceptPageNumber();
      const isSameParams = params === lastParams.current;
      lastParams.current = params;

      if (keepOpenOnResultsChange && !event && openImage && isSameParams) {
        if (!hash) {
          const { pathname, search: urlSearch } = window.location;
          window.history.replaceState(
            window.history.state,
            '',
            `${pathname}${urlSearch}#${openImage.id}`
          );
        }
        if (!hash || hash === openImage.id) return;
      }

      if (!hash) {
        setExpandedImage(undefined);
      }
      // see if the new hash is already in the imageMap
      if (imageMap[hash]) {
        // if it is, update the expanded image
        setExpandedImage(imageMap[hash]);
      } else {
        // if it's not, fetch the image and then update
        const { image } = await getImage({
          id: hash,
          shouldUseStagingApi: stagingApi,
          pipelineCluster: cataloguePipeline,
        });

        if (image.type === 'Image') {
          imageMap[image.id] = image;
          setExpandedImage(image);
        } else if (image.type === 'Error') {
          setExpandedImage(undefined);
        }
      }
    };
    onHashChanged();
    window.addEventListener('hashchange', onHashChanged);
    return () => {
      window.removeEventListener('hashchange', onHashChanged);
    };
  }, [imageMap]);

  useEffect(() => {
    // Store the current scroll position, before the hash changes
    const scrollY = window.scrollY;

    if (expandedImage !== undefined) {
      hasBeenExpanded.current = true;
      setImageIdInURL(expandedImage?.id || '');
      // The browser will try to scroll to the #id but we
      // want to keep it where it is
      window.scroll(0, scrollY);
    } else if (hasBeenExpanded.current) {
      // clear the url of the fragments and also removes the # symbol
      setImageIdInURL('');
      // The url now has an empty hash so the browser will try to scroll
      // to the top but we want to keep it where it is
      window.scroll(0, scrollY);
    }
  }, [expandedImage]);

  return [expandedImage, setExpandedImage];
};

export default useExpandedImage;
