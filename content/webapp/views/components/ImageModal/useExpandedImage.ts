import {
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { ServerDataContext } from '@weco/common/server-data/Context';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';

const useExpandedImage = (
  images: Image[]
): [Image | undefined, Dispatch<SetStateAction<Image | undefined>>] => {
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  const { toggles } = useContext(ServerDataContext);
  const hasBeenExpanded = useRef(false);

  const imageMap = useMemo<Record<string, Image>>(
    () => images.reduce((a, image) => ({ ...a, [image.id]: image }), {}),
    [images]
  );

  const setImageIdInURL = (id: string) => {
    window.location.hash = id;
  };

  useEffect(() => {
    const onHashChanged = async () => {
      // to trim the '#' symbol
      const hash = window.location.hash.slice(1);

      if (!hash) {
        setExpandedImage(undefined);
      }
      // see if the new hash is already in the imageMap
      if (imageMap[hash]) {
        // if it is, update the expanded image
        setExpandedImage(imageMap[hash]);
      } else {
        // if it's not, fetch the image and then update
        const { image } = await getImage({ id: hash, toggles });

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
    if (expandedImage !== undefined) {
      // Store the current scroll position
      const scrollY = window.scrollY;
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
