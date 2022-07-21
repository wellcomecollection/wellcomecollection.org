import { FC } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import * as prismicT from '@prismicio/types';
import { ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';

const TitleTombstone = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-right'] },
  v: { size: 'l', properties: ['margin-bottom'] },
})`
  flex-basis: 100%;

  ${props => props.theme.media.medium`
    flex-basis: 40%;
  `}

  ${props => props.theme.media.large`
    flex-basis: 25%;
  `}
`;

const CaptionTranscription = styled.div`
  flex-basis: 100%;

  ${props => props.theme.media.medium`
    flex-basis: 60%;
  `}

  ${props => props.theme.media.large`
    flex-basis: 75%;
  `}
`;

const Caption = styled(Space).attrs<{ hasTranscription: boolean }>(props => ({
  className: 'spaced-text',
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: props.hasTranscription
    ? {
        size: 'l',
        properties: ['padding-bottom'],
      }
    : undefined,
}))<{ hasTranscription: boolean }>`
  border-left: 10px solid ${props => props.theme.color('yellow')};
`;

const Transcription = styled(Space).attrs({
  className: 'spaced-text',
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 10px solid ${props => props.theme.color('purple')};
`;

type Stop = {
  number: number;
  title: string;
  image?: ImageType;
  tombstone: prismicT.RichTextField;
  caption: prismicT.RichTextField;
  transcription?: prismicT.RichTextField;
};

type Props = {
  stops: [Stop];
};

const ExhibitionCaptions: FC<Props> = ({ stops }) => {
  return (
    <ul className="plain-list no-margin no-padding">
      {stops.map(stop => (
        <Space
          key={stop.number}
          className="flex flex--wrap"
          v={{ size: 'xl', properties: ['margin-bottom'] }}
        >
          <TitleTombstone>
            <h2>
              {stop.number}. {stop.title}
            </h2>
            <em>{stop.tombstone}</em>
          </TitleTombstone>
          <CaptionTranscription>
            <Caption hasTranscription={Boolean(stop.transcription)}>
              {stop.image?.contentUrl && (
                <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                  <PrismicImage
                    image={{
                      contentUrl: stop.image.contentUrl,
                      width: stop.image.width,
                      height: stop.image.height,
                      alt: stop.image.alt,
                    }}
                    sizes={{}}
                    quality={`low`}
                  />
                </Space>
              )}
              <PrismicHtmlBlock html={stop.caption} />
            </Caption>
            {stop.transcription && (
              <Transcription>
                <h3>Audio transcript</h3>
                <PrismicHtmlBlock html={stop.transcription} />
              </Transcription>
            )}
          </CaptionTranscription>
        </Space>
      ))}
    </ul>
  );
};

export default ExhibitionCaptions;
