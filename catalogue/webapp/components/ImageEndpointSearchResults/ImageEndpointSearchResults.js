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
  const [expandedImageId, setExpandedImageId] = useState('');

  return (
    <div className={'flex flex--wrap'}>
      {images.results.map((result: Image, i) => (
        <div key={result.id}>
          <ImageCard
            id={result.id}
            image={{
              contentUrl: result.locations[0].url,
              width: 300,
              height: 300,
              alt: '',
              tasl: null,
            }}
            onClick={event => {
              event.preventDefault();
              setExpandedImageId(result.id);
            }}
          />
          {expandedImageId === result.id && (
            <ExpandedImage
              title=""
              imageId={result.id}
              workId={result.source.id}
              setExpandedImageId={setExpandedImageId}
              onWorkLinkClick={() => {
                trackSearchResultSelected(apiProps, {
                  id: result.source.id,
                  position: i,
                  resultIdentifiers: undefined,
                  resultLanguage: undefined,
                  resultSubjects: undefined,
                  resultWorkType: '',
                  source: 'image_endpoint_result/work_link',
                });
              }}
              onImageLinkClick={() => {
                trackSearchResultSelected(apiProps, {
                  id: result.id,
                  position: i,
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
      ))}
    </div>
  );
};

export default ImageEndpointSearchResults;
