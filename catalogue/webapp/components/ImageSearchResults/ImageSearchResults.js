// @flow

import { useState } from 'react';
import ExpandedImage from '../ExpandedImage/ExpandedImage';
import ImageCard from '../ImageCard/ImageCard';
import { trackSearchResultSelected } from '@weco/common/views/components/Tracker/Tracker';
import { type CatalogueResultsList } from '@weco/common/model/catalogue';
import { type CatalogueApiProps } from '@weco/common/services/catalogue/api';

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
          <div
            onClick={() => {
              trackSearchResultSelected(apiProps, {
                id: result.id,
                position: i,
                resultWorkType: result.workType.label,
                resultLanguage: result.language && result.language.label,
                resultIdentifiers: result.identifiers.map(
                  identifier => identifier.value
                ),
                resultSubjects: result.subjects.map(subject => subject.label),
              });
            }}
          >
            <ImageCard
              id={result.id}
              image={{
                contentUrl: result.thumbnail
                  ? result.thumbnail.url
                  : 'https://via.placeholder.com/1600x900?text=%20',
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
              />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ImageSearchResults;
