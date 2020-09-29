// @flow

import { useState } from 'react';
import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
import {
  type CatalogueResultsList,
  type Image,
} from '@weco/common/model/catalogue';
import { type CatalogueImagesApiProps } from '@weco/common/services/catalogue/api';

type Props = {|
  images: CatalogueResultsList<Image>,
  apiProps: CatalogueImagesApiProps,
|};

const ImageEndpointSearchResults = ({ images, apiProps }: Props) => {
  const [expandedImage, setExpandedImage] = useState();
  // In the case that the modal changes the expanded image to
  // be one that isn't on this results page, this index will be -1
  const expandedImagePosition = images.results.findIndex(
    img => expandedImage && img.id === expandedImage.id
  );

  return (
    <div className={'flex flex--wrap'}>
      {images.results.map((result: Image, i) => (
        <div key={result.id}>
          <ImageCard
            id={result.id}
            workId={result.source.id}
            image={{
              contentUrl: result.locations[0].url,
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
        </div>
      ))}
      {expandedImage && (
        <ExpandedImage
          title=""
          image={expandedImage}
          workId={expandedImage.source.id}
          setExpandedImage={setExpandedImage}
          onWorkLinkClick={() => {
            trackSearchResultSelected(apiProps, {
              id: expandedImage.source.id,
              position: expandedImagePosition,
              resultIdentifiers: undefined,
              resultLanguage: undefined,
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
              resultLanguage: undefined,
              resultIdentifiers: undefined,
              resultSubjects: undefined,
              source: 'image_endpoint_result/image_link',
            });
          }}
        />
      )}
    </div>
  );
};

export default ImageEndpointSearchResults;
