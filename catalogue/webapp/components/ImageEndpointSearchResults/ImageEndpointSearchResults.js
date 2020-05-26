// @flow

import { useState } from 'react';
import ExpandedEndpointImage from '../ExpandedEndpointImage/ExpandedEndpointImage';
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
            <ExpandedEndpointImage
              id={result.id}
              locations={result.locations}
              sourceId={result.source.id}
              setExpandedImageId={setExpandedImageId}
              onWorkLinkClick={() => {
                trackSearchResultSelected(apiProps, {
                  id: result.id,
                  position: i,
                  resultIdentifiers: result.source.id,
                  source: 'image_endpoint_result/work_link',
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
