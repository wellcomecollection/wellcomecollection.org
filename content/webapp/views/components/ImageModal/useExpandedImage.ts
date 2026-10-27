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
  const lastSearch = useRef<string | undefined>(undefined);
  const expandedImageRef = useRef(expandedImage);
  expandedImageRef.current = expandedImage;

  const imageMap = useMemo<Record<string, Image>>(
    () => images.reduce((a, image) => ({ ...a, [image.id]: image }), {}),
    [images]
  );

  const setImageIdInURL = (id: string) => {
    if (id) {
      window.location.hash = id;
      return;
    }

    // Setting the hash to nothing leaves a '#' on the end of the URL, so add
    // an entry for the URL without one instead. Not when there's no hash to
    // clear (e.g. after Back), as that would drop the entries ahead of this one.
    const { pathname, search, hash } = window.location;
    if (hash) {
      // Next keeps the URL it thinks the entry has in its state, which has the
      // image's id on it. Left there, going Back to this entry would put it back.
      const { state } = window.history;
      window.history.pushState(
        typeof state?.as === 'string'
          ? { ...state, as: state.as.split('#')[0] }
          : state,
        '',
        `${pathname}${search}`
      );

      // pushState doesn't fire this, and other instances of the hook on the
      // page (e.g. each gallery's) need it to know the image has been closed
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    }
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

      // Going Back to an entry without an image also gives new results, but
      // the page is the same, and that should close the image
      const { search } = window.location;
      const isNewPage = lastSearch.current !== search;
      lastSearch.current = search;

      if (
        keepOpenOnResultsChange &&
        !event &&
        openImage &&
        isSameParams &&
        isNewPage
      ) {
        if (!hash) {
          window.history.replaceState(
            window.history.state,
            '',
            `${window.location.pathname}${search}#${openImage.id}`
          );
        }
        if (!hash || hash === openImage.id) return;
      }

      if (!hash) {
        setExpandedImage(undefined);
        return;
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
      // clear the id, and the # symbol with it
      setImageIdInURL('');
    }
  }, [expandedImage]);

  return [expandedImage, setExpandedImage];
};

export default useExpandedImage;
