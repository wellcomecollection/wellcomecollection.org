import { FunctionComponent } from 'react';

import Space from '@weco/common/views/components/styled/Space';
import { Image } from '@weco/content/services/wellcome/catalogue/types';
import { useExpandedImage } from '@weco/content/views/components/ImageModal';
import ScrollContainer from '@weco/content/views/components/ScrollContainer';

import ImageCard from './CatalogueImageGallery.ImageCard';

const IMAGE_HEIGHT = 200;

export type Props = {
  images: Image[];
  label?: string;
};

const CatalogueImageGalleryScrollable: FunctionComponent<Props> = ({
  images,
  label,
}: Props) => {
  const [, setExpandedImage] = useExpandedImage(images);

  return (
    <ScrollContainer label={label} isDarkMode hasLeftOffset>
      {images.map((image, index) => (
        <li key={image.id} style={{ maxWidth: '90vw' }}>
          <Space $h={{ size: 'm', properties: ['margin-right'] }}>
            <ImageCard
              id={image.id}
              workId={image.source.id}
              positionInList={index + 1}
              image={{
                contentUrl: image.locations[0].url,
                width: IMAGE_HEIGHT * (image.aspectRatio || 1),
                height: IMAGE_HEIGHT,
                alt: image.source.title,
              }}
              onClick={event => {
                event.preventDefault();
                setExpandedImage(image);
              }}
              layout="fixed"
            />
          </Space>
        </li>
      ))}
    </ScrollContainer>
  );
};

export default CatalogueImageGalleryScrollable;
