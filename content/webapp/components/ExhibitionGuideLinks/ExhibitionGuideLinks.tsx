import { FunctionComponent } from 'react';

import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import Space from '@weco/common/views/components/styled/Space';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';

import TypeOption, { TypeList } from './TypeOption';

type Props = {
  pathname: string;
  availableTypes: {
    BSLVideo: boolean;
    captionsOrTranscripts: boolean;
    audioWithoutDescriptions: boolean;
  };
};

export const ExhibitionGuideLinks: FunctionComponent<Props> = ({
  pathname,
  availableTypes,
}) => {
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
                url={`/${pathname}/audio-without-descriptions`}
                title="Audio descriptive tour with transcripts"
                type="audio-without-descriptions"
              />
            )}
            {availableTypes.BSLVideo && (
              <TypeOption
                url={`/${pathname}/bsl`}
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
              url={`/${pathname}/captions-and-transcripts`}
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
                url={`/${audioPathname}${stopNumber ? `/${stopNumber}` : ''}`}
                title="Listen to audio"
                type="audio-without-descriptions"
              />
            )}
            {videoPathname && (
              <TypeOption
                url={`/${videoPathname}${stopNumber ? `/${stopNumber}` : ''}`}
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
              url={`/${textPathname}`}
              title="Exhibition text"
              type="captions-and-transcripts"
            />
          </TypeList>
        </ConditionalWrapper>
      )}
    </>
  );
};
