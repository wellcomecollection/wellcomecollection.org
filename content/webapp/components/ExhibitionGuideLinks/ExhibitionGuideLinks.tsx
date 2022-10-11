import { setCookie } from 'cookies-next';
import { FC } from 'react';
import styled from 'styled-components';
import {
  britishSignLanguage,
  audioDescribed,
  speechToText,
} from '@weco/common/icons';
import TypeOption from './TypeOption';
import cookies from '@weco/common/data/cookies';

const TypeList = styled.ul`
  list-style: none;
  margin: 0 !important;
  padding: 0;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  ${props => props.theme.media('medium')`
    gap: 50px;
`}
`;

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
  // We set the cookie to expire in 8 hours (the maximum length of time the collection is open for in a day)
  const options = { maxAge: 8 * 60 * 60, path: '/' };
  setCookie(key, data, options);
}

const ExhibitionGuideLinks: FC<Props> = ({ pathname, availableTypes }) => {
  return (
    <TypeList>
      {availableTypes.audioWithoutDescriptions && (
        <TypeOption
          url={`/${pathname}/audio-without-descriptions`}
          title="Listen, without audio descriptions"
          text="Find out more about the exhibition with short audio tracks."
          color="accent.lightSalmon"
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
          title="Listen, with audio descriptions"
          text="Find out more about the exhibition with short audio tracks,
            including descriptions of the objects."
          color="accent.lightPurple"
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
          text="All the wall and label texts from the gallery, and images of the
                  objects, great for those without headphones."
          color="accent.lightGreen"
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
          title="Watch BSL videos"
          text="Commentary about the exhibition in British Sign Language videos."
          color="accent.lightBlue"
          icon={britishSignLanguage}
          onClick={() => {
            cookieHandler(cookies.exhibitionGuideType, 'bsl');
          }}
        />
      )}
    </TypeList>
  );
};

export default ExhibitionGuideLinks;
