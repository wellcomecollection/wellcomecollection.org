import { FunctionComponent } from 'react';
import {
  britishSignLanguage,
  audioDescribed,
  speechToText,
} from '@weco/common/icons';
import TypeOption, { TypeList } from './TypeOption';
import { useToggles } from '@weco/common/server-data/Context';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import Space from '@weco/common/views/components/styled/Space';

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
  const { egWork } = useToggles();

  return (
    <>
      {egWork ? (
        <>
          {(availableTypes.audioWithoutDescriptions ||
            availableTypes.BSLVideo) && (
            <>
              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <SectionHeader title="Highlights tour" />
              </Space>
              <p>
                Find out more about the exhibition with our highlights tour,
                available in short audio clips with transcripts or as British
                Sign Language videos.
              </p>
              <TypeList>
                {availableTypes.audioWithoutDescriptions && (
                  <TypeOption
                    url={`/${pathname}/audio-without-descriptions`}
                    title="Audio descriptive tour with transcripts"
                    text="Find out more about the exhibition with short audio tracks."
                    backgroundColor="accent.lightSalmon"
                    icon={audioDescribed}
                    type="audio-without-descriptions"
                  />
                )}
                {availableTypes.BSLVideo && (
                  <TypeOption
                    url={`/${pathname}/bsl`}
                    title="British Sign Language tour with transcripts"
                    text="Commentary about the exhibition in British Sign Language videos."
                    backgroundColor="accent.lightBlue"
                    icon={britishSignLanguage}
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
                  text="All the wall and label texts from the gallery, plus audio transcripts – great for those without headphones."
                  backgroundColor="accent.lightGreen"
                  icon={speechToText}
                  type="captions-and-transcripts"
                />
              </TypeList>
            </Space>
          )}
        </>
      ) : (
        <TypeList>
          {availableTypes.audioWithoutDescriptions && (
            <TypeOption
              url={`/${pathname}/audio-without-descriptions`}
              title="Listen to audio"
              text="Find out more about the exhibition with short audio tracks."
              backgroundColor="accent.lightSalmon"
              icon={audioDescribed}
              type="audio-without-descriptions"
            />
          )}
          {availableTypes.captionsOrTranscripts && (
            <TypeOption
              url={`/${pathname}/captions-and-transcripts`}
              title="Read captions and transcripts"
              text="All the wall and label texts from the gallery, plus audio transcripts – great for those without headphones."
              backgroundColor="accent.lightGreen"
              icon={speechToText}
              type="captions-and-transcripts"
            />
          )}
          {availableTypes.BSLVideo && (
            <TypeOption
              url={`/${pathname}/bsl`}
              title="Watch British Sign Language videos"
              text="Commentary about the exhibition in British Sign Language videos."
              backgroundColor="accent.lightBlue"
              icon={britishSignLanguage}
              type="bsl"
            />
          )}
        </TypeList>
      )}
    </>
  );
};

type ResourceProps = {
  textPathname?: string;
  audioPathname?: string;
  videoPathname?: string;
};

export const ExhibitionResourceLinks: FunctionComponent<ResourceProps> = ({
  textPathname,
  audioPathname,
  videoPathname,
}) => {
  const { egWork } = useToggles();

  return (
    <>
      {egWork ? (
        <>
          {(audioPathname || videoPathname) && (
            <>
              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <SectionHeader title="Highlights tour" />
              </Space>
              <p>
                Find out more about the exhibition with our highlights tour,
                available in short audio clips with transcripts or as British
                Sign Language videos.
              </p>
              <TypeList>
                {audioPathname && (
                  <TypeOption
                    url={`/${audioPathname}`}
                    title="Audio descriptive tour with transcripts"
                    text="Find out more about the exhibition with short audio tracks."
                    backgroundColor="accent.lightSalmon"
                    icon={audioDescribed}
                    type="audio-without-descriptions"
                  />
                )}
                {videoPathname && (
                  <TypeOption
                    url={`/${videoPathname}`}
                    title="British Sign Language tour with transcripts"
                    text="Commentary about the exhibition in British Sign Language videos."
                    backgroundColor="accent.lightBlue"
                    icon={britishSignLanguage}
                    type="bsl"
                  />
                )}
              </TypeList>
            </>
          )}
          {textPathname && (
            <>
              <Space $v={{ size: 'l', properties: ['margin-bottom'] }}>
                <SectionHeader title="Exhibition text" />
              </Space>
              <p>All the wall and label text from the exhibition.</p>
              <TypeList>
                <TypeOption
                  url={`/${textPathname}`}
                  title="Exhibition text"
                  text="All the wall and label texts from the gallery, plus audio transcripts – great for those without headphones."
                  backgroundColor="accent.lightGreen"
                  icon={speechToText}
                  type="captions-and-transcripts"
                />
              </TypeList>
            </>
          )}
        </>
      ) : (
        <TypeList>
          {audioPathname && (
            <TypeOption
              url={`/${audioPathname}`}
              title="Listen to audio"
              text="Find out more about the exhibition with short audio tracks."
              backgroundColor="accent.lightSalmon"
              icon={audioDescribed}
              type="audio-without-descriptions"
            />
          )}
          {textPathname && (
            <TypeOption
              url={`/${textPathname}`}
              title="Read captions and transcripts"
              text="All the wall and label texts from the gallery, plus audio transcripts – great for those without headphones."
              backgroundColor="accent.lightGreen"
              icon={speechToText}
              type="captions-and-transcripts"
            />
          )}
          {videoPathname && (
            <TypeOption
              url={`/${videoPathname}`}
              title="Watch British Sign Language videos"
              text="Commentary about the exhibition in British Sign Language videos."
              backgroundColor="accent.lightBlue"
              icon={britishSignLanguage}
              type="bsl"
            />
          )}
        </TypeList>
      )}
    </>
  );
};
