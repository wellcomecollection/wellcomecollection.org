// @flow

import { useState } from 'react';
import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
import { type CatalogueResultsList } from '@weco/common/model/catalogue';
import { type CatalogueApiProps } from '@weco/common/services/catalogue/api';
import { transparentGif } from '@weco/common/utils/backgrounds';

type Props = {|
  works: CatalogueResultsList,
  apiProps: CatalogueApiProps,
|};

const ImageSearchResults = ({ works, apiProps }: Props) => {
  const [expandedImageId, setExpandedImageId] = useState('');

  return (
    <div className={'flex flex--wrap'}>
      {works.results.map((result, i) => (
        <div key={result.id}>
          <ImageCard
            id={result.id}
            image={{
              contentUrl: result.thumbnail
                ? result.thumbnail.url
                : transparentGif,
              width: 300,
              height: 300,
              alt: result.title,
              tasl: null,
            }}
            onClick={event => {
              event.preventDefault();
              setExpandedImageId(result.id);
            }}
          />
          {expandedImageId === result.id && (
            <ExpandedImage
              title={result.title}
              id={result.id}
              setExpandedImageId={setExpandedImageId}
              onWorkLinkClick={() => {
                trackSearchResultSelected(apiProps, {
                  id: result.id,
                  position: i,
                  resultWorkType: result.workType.label,
                  resultLanguage: result.language && result.language.label,
                  resultIdentifiers: result.identifiers.map(
                    identifier => identifier.value
                  ),
                  resultSubjects: result.subjects.map(subject => subject.label),
                  source: 'image_result/work_link',
                });
              }}
              onImageLinkClick={() => {
                trackSearchResultSelected(apiProps, {
                  id: result.id,
                  position: i,
                  resultWorkType: result.workType.label,
                  resultLanguage: result.language && result.language.label,
                  resultIdentifiers: result.identifiers.map(
                    identifier => identifier.value
                  ),
                  resultSubjects: result.subjects.map(subject => subject.label),
                  source: 'image_result/image_link',
                });
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default ImageSearchResults;
