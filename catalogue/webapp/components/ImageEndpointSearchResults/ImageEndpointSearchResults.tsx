import { FunctionComponent, useState } from 'react';
import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import { Image, CatalogueResultsList } from '@weco/common/model/catalogue';

type Props = {
  images: CatalogueResultsList<Image>;
};

const ImageEndpointSearchResults: FunctionComponent<Props> = ({
  images,
}: Props) => {
  const [expandedImage, setExpandedImage] = useState<Image | undefined>();
  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const expandedImagePosition = images.results.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );

  return (
    <ul
      className={'flex flex--wrap plain-list no-padding no-margin'}
      role="list"
    >
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
              tasl: null,
            }}
            onClick={event => {
              event.preventDefault();
              setExpandedImage(result);
            }}
          />
        </li>
      ))}
      {expandedImage && (
        <ExpandedImage
          resultPosition={expandedImagePosition}
          image={expandedImage}
          setExpandedImage={setExpandedImage}
          id="expanded-image-dialog"
        />
      )}
    </ul>
  );
};

export default ImageEndpointSearchResults;
