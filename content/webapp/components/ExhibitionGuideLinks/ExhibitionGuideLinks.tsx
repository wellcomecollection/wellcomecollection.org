import { FunctionComponent } from 'react';

import linkResolver from '@weco/common/services/prismic/link-resolver';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import { ExhibitionGuide } from '@weco/content/types/exhibition-guides';

import TypeOption, { TypeList } from './TypeOption';

type Props = {
  exhibitionGuide: ExhibitionGuide;
};

export const ExhibitionGuideLinks: FunctionComponent<Props> = ({
  exhibitionGuide,
}) => {
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

type ResourceProps = {
  textPathname?: string;
  audioPathname?: string;
  videoPathname?: string;
  stopNumber?: string;
};

export const ExhibitionResourceLinks: FunctionComponent<ResourceProps> = ({
  textPathname,
  audioPathname,
  videoPathname,
  stopNumber,
}) => {
  const hasAudioVideo = !!(audioPathname || videoPathname);

  return (
    <>
      {hasAudioVideo && (
        <>
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <SectionHeader title="Highlights tour" />
          </Space>
          <p>
            Find out more about the exhibition with our highlights tour,
            available in short audio clips with audio description and
            transcripts, or as British Sign Language videos.
          </p>
          <TypeList>
            {audioPathname && (
              <TypeOption
                url={`${audioPathname}${stopNumber ? `/${stopNumber}` : ''}`}
                title="Listen to audio"
                type="audio-without-descriptions"
              />
            )}
            {videoPathname && (
              <TypeOption
                url={`${videoPathname}${stopNumber ? `/${stopNumber}` : ''}`}
                title="Watch British Sign Language videos"
                type="bsl"
              />
            )}
          </TypeList>
        </>
      )}
      {textPathname && (
        <ConditionalWrapper
          condition={hasAudioVideo}
          wrapper={children => (
            <Space $v={{ size: 'xl', properties: ['margin-top'] }}>
              {children}
            </Space>
          )}
        >
          <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
            <SectionHeader title="Exhibition text" />
          </Space>
          <p>All the wall and label text from the exhibition.</p>
          <TypeList>
            <TypeOption
              url={textPathname}
              title="Exhibition text"
              type="captions-and-transcripts"
            />
          </TypeList>
        </ConditionalWrapper>
      )}
    </>
  );
};
