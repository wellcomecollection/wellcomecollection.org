import { FunctionComponent } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import SectionHeader from '@weco/common/views/components/SectionHeader';
import Space from '@weco/common/views/components/styled/Space';
import { ExhibitionGuide } from '@weco/content/types/exhibition-guides';

import TypeOption, { TypeList } from './exhibition.TypeOption';

type Props = {
  exhibitionGuide: ExhibitionGuide;
};

const GuideLinks: FunctionComponent<Props> = ({ exhibitionGuide }) => {
  const { availableTypes } = exhibitionGuide;
  return (
    <>
      {(availableTypes.audioWithoutDescriptions || availableTypes.BSLVideo) && (
        <>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <SectionHeader title="Highlights tour" />
          </Space>
          <p>
            Find out more about the exhibition with our highlights tour,
            available in short audio clips with transcripts or as British Sign
            Language videos.
          </p>
          <TypeList>
            {availableTypes.audioWithoutDescriptions && (
              <TypeOption
                url={linkResolver({
                  ...exhibitionGuide,
                  highlightTourType: 'audio',
                })}
                title="Audio descriptive tour with transcripts"
                type="audio-without-descriptions"
              />
            )}
            {availableTypes.BSLVideo && (
              <TypeOption
                url={linkResolver({
                  ...exhibitionGuide,
                  highlightTourType: 'bsl',
                })}
                title="British Sign Language tour with transcripts"
                type="bsl"
              />
            )}
          </TypeList>
        </>
      )}

      {availableTypes.captionsOrTranscripts && (
        <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <SectionHeader title="Exhibition text" />
          </Space>
          <p>All the wall and label text from the exhibition.</p>
          <TypeList>
            <TypeOption
              url={linkResolver({
                ...exhibitionGuide,
                highlightTourType: 'text',
              })}
              title="Exhibition text"
              type="captions-and-transcripts"
            />
          </TypeList>
        </Space>
      )}
    </>
  );
};

export default GuideLinks;
