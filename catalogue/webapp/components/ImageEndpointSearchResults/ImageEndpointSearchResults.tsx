import { FunctionComponent, useEffect, useState } from 'react';
import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import { Image, CatalogueResultsList } from '@weco/common/model/catalogue';
import Modal from '@weco/common/views/components/Modal/Modal';
import { useRouter } from 'next/router';

type Props = {
  images: CatalogueResultsList<Image>;
};

const ImageEndpointSearchResults: FunctionComponent<Props> = ({
  images,
}: Props) => {
  const router = useRouter();
  const { page, imageId: routerImageId } = router.query;

  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const expandedImagePosition = images.results.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );
  const [isActive, setIsActive] = useState(false);

  // Gets the image as it might not be in the current results, and displays it.
  const getImage = async routerImageId => {
    const apiUrl = `https://api.wellcomecollection.org/catalogue/v2/images/${routerImageId}`;
    const image: Image = await fetch(apiUrl).then(res => res.json());

    if (image) {
      setExpandedImage(image);
      setIsActive(true);
    }
  };

  useEffect(() => {
    // If there is a set expandedImage and it's a different one than the current queried one
    // Change URL to reflect the change
    if (!!expandedImage && routerImageId !== expandedImage.id) {
      router.push(
        `${router.pathname}?${page ? 'page=' + page + '&' : ''}imageId=${
          expandedImage.id
        }`,
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [expandedImage]);

  useEffect(() => {
    // If isActive changes to false, reset the URL to no imageId
    if (!isActive) {
      router.push(
        `${router.pathname}${page ? '?page=' + page : ''}`,
        undefined,
        {
          shallow: true,
        }
      );
    }
  }, [isActive]);

  useEffect(() => {
    // If there is an imageId in the query, fetch that image and display it
    // Otherwise ensure modal is closed and URL resets
    routerImageId ? getImage(routerImageId) : setIsActive(false);
  }, [routerImageId]);

  return (
    <ul className="flex flex--wrap plain-list no-padding no-margin" role="list">
      {images.results.map((result: Image) => (
        <li key={result.id} role="listitem">
          <ImageCard
            id={result.id}
            workId={result.source.id}
            image={{
              contentUrl: result.locations[0]?.url,
              width: 300,
              height: 300,
              alt: '',
            }}
            onClick={event => {
              event.preventDefault();
              setExpandedImage(result);
              setIsActive(true);
            }}
          />
        </li>
      ))}
      <Modal
        id={'expanded-image-dialog'}
        isActive={isActive}
        setIsActive={setIsActive}
        width={'80vw'}
      >
        <ExpandedImage
          resultPosition={expandedImagePosition}
          image={expandedImage}
          setExpandedImage={setExpandedImage}
        />
      </Modal>
    </ul>
  );
};

export default ImageEndpointSearchResults;
