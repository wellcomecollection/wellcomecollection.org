import { setCookie } from 'cookies-next';
import { FunctionComponent } from 'react';
import {
  britishSignLanguage,
  audioDescribed,
  speechToText,
} from '@weco/common/icons';
import TypeOption, { TypeList } from './TypeOption';
import cookies from '@weco/common/data/cookies';

type Props = {
  pathname: string;
  availableTypes: {
    BSLVideo: boolean;
    captionsOrTranscripts: boolean;
    audioWithoutDescriptions: boolean;
    audioWithDescriptions: boolean;
  };
};

function cookieHandler(key: string, data: string) {
  // We set the cookie to expire in 8 hours (the maximum length of
  // time the galleries are open in a day)
  const options = {
    maxAge: 8 * 60 * 60,
    path: '/',
    secure: true,
  };
  setCookie(key, data, options);
}

export const ExhibitionGuideLinks: FunctionComponent<Props> = ({
  pathname,
  availableTypes,
}) => {
  return (
    <TypeList>
      {availableTypes.audioWithoutDescriptions && (
        <TypeOption
          url={`/${pathname}/audio-without-descriptions`}
          title="Listen to audio"
          text="Find out more about the exhibition with short audio tracks."
          backgroundColor="accent.lightSalmon"
          icon={audioDescribed}
          onClick={() => {
            cookieHandler(
              cookies.exhibitionGuideType,
              'audio-without-descriptions'
            );
          }}
        />
      )}
      {availableTypes.audioWithDescriptions && (
        <TypeOption
          url={`/${pathname}/audio-with-descriptions`}
          title="Listen to audio with wayfinding"
          text="Find out more about the exhibition with short audio tracks,
            including descriptions of the objects."
          backgroundColor="accent.lightPurple"
          icon={audioDescribed}
          onClick={() => {
            cookieHandler(
              cookies.exhibitionGuideType,
              'audio-with-descriptions'
            );
          }}
        />
      )}
      {availableTypes.captionsOrTranscripts && (
        <TypeOption
          url={`/${pathname}/captions-and-transcripts`}
          title="Read captions and transcripts"
          text="All the wall and label texts from the gallery, plus audio transcripts – great for those without headphones."
          backgroundColor="accent.lightGreen"
          icon={speechToText}
          onClick={() => {
            cookieHandler(
              cookies.exhibitionGuideType,
              'captions-and-transcripts'
            );
          }}
        />
      )}
      {availableTypes.BSLVideo && (
        <TypeOption
          url={`/${pathname}/bsl`}
          title="Watch British Sign Language videos"
          text="Commentary about the exhibition in British Sign Language videos."
          backgroundColor="accent.lightBlue"
          icon={britishSignLanguage}
          onClick={() => {
            cookieHandler(cookies.exhibitionGuideType, 'bsl');
          }}
        />
      )}
    </TypeList>
  );
};

type ResourceProps = {
  textPathname: string | undefined; // TODO make these more specifid=c?
  audioPathname: string | undefined;
  videoPathname: string | undefined;
};

export const ExhibitionResourceLinks: FunctionComponent<ResourceProps> = ({
  textPathname,
  audioPathname,
  videoPathname,
}) => {
  return (
    <TypeList>
      {audioPathname && (
        <TypeOption
          url={`/${audioPathname}`}
          title="Listen to audio"
          text="Find out more about the exhibition with short audio tracks."
          backgroundColor="accent.lightSalmon"
          icon={audioDescribed}
          onClick={() => {
            cookieHandler(
              cookies.exhibitionGuideType,
              'audio-without-descriptions'
            );
          }}
        />
      )}
      {textPathname && (
        <TypeOption
          url={`/${textPathname}`}
          title="Read captions and transcripts"
          text="All the wall and label texts from the gallery, plus audio transcripts – great for those without headphones."
          backgroundColor="accent.lightGreen"
          icon={speechToText}
          onClick={() => {
            cookieHandler(
              cookies.exhibitionGuideType,
              'captions-and-transcripts'
            );
          }}
        />
      )}
      {videoPathname && (
        <TypeOption
          url={`/${videoPathname}`}
          title="Watch British Sign Language videos"
          text="Commentary about the exhibition in British Sign Language videos."
          backgroundColor="accent.lightBlue"
          icon={britishSignLanguage}
          onClick={() => {
            cookieHandler(cookies.exhibitionGuideType, 'bsl');
          }}
        />
      )}
    </TypeList>
  );
};
