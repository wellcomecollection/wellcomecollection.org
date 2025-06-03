import {
  FunctionComponent,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import PhotoAlbum, {
  RenderPhotoProps,
  RenderRowContainer,
} from 'react-photo-album';
import styled from 'styled-components';

import { useAppContext } from '@weco/common/contexts/AppContext';
import { ServerDataContext } from '@weco/common/server-data/Context';
import Modal from '@weco/common/views/components/Modal';
import PlainList from '@weco/common/views/components/styled/PlainList';
import Space from '@weco/common/views/components/styled/Space';
import ExpandedImage from '@weco/content/components/ExpandedImage';
import ImageCard from '@weco/content/components/ImageCard';
import { getImage } from '@weco/content/services/wellcome/catalogue/images';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { hexToRgb } from '@weco/content/utils/convert-colors';

const useExpandedImage = (images: Image[]) => {
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  const { toggles } = useContext(ServerDataContext);

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
      setImageIdInURL(expandedImage?.id || '');
    } else {
      // clear the url of the fragments and also removes the # symbol
      setImageIdInURL('');
    }
  }, [expandedImage]);

  return [expandedImage, setExpandedImage];
};

export default useExpandedImage;
