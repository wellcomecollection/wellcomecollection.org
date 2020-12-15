import { FunctionComponent, useState } from 'react';
import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
import { Image, CatalogueResultsList } from '@weco/common/model/catalogue';
import { CatalogueImagesApiProps } from '@weco/common/services/catalogue/ts_api';

type Props = {
  images: CatalogueResultsList<Image>;
  apiProps: CatalogueImagesApiProps;
};

const ImageEndpointSearchResults: FunctionComponent<Props> = ({
  images,
  apiProps,
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
      aria-labelledby="image-results"
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
          image={expandedImage}
          setExpandedImage={setExpandedImage}
          onWorkLinkClick={() => {
            trackSearchResultSelected(apiProps, {
              id: expandedImage.source.id,
              position: expandedImagePosition,
              resultIdentifiers: undefined,
              resultSubjects: undefined,
              resultWorkType: '',
              source: 'image_endpoint_result/work_link',
            });
          }}
          onImageLinkClick={() => {
            trackSearchResultSelected(apiProps, {
              id: expandedImage.id,
              position: expandedImagePosition,
              resultWorkType: '',
              resultIdentifiers: undefined,
              resultSubjects: undefined,
              source: 'image_endpoint_result/image_link',
            });
          }}
        />
      )}
    </ul>
  );
};

export default ImageEndpointSearchResults;
