import { FC, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import * as prismicT from '@prismicio/types';
import { ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import { font } from '@weco/common/utils/classnames';

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
  max-width: 45em;

  ${props => props.theme.media.medium`
    flex-basis: 60%;
  `}

  ${props => props.theme.media.large`
    flex-basis: 75%;
  `}
`;

const Caption = styled(Space).attrs({
  className: 'spaced-text',
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['margin-bottom'] },
})`
  border-left: 10px solid ${props => props.theme.color('yellow')};
`;

const PrismicImageWrapper = styled.div`
  max-width: 600px;
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
  stops: Stop[];
};

const Stop: FC<{ stop: Stop }> = ({ stop }) => {
  const { isEnhanced } = useContext(AppContext);
  const hasShowFullTranscriptionButton =
    (stop.transcription?.length || 0) > 1 && isEnhanced; // We only show the button if there is more than one paragraph
  const transcriptionFirstParagraph = stop.transcription?.slice(0, 1);
  const [isFullTranscription, setIsFullTranscription] = useState(true);
  const [transcriptionText, setTranscriptionText] = useState(
    transcriptionFirstParagraph
  );

  useEffect(() => {
    // Show full audio transcripts by default and hide them once we know
    // JavaScript is available
    setIsFullTranscription(false);
  }, []);

  useEffect(() => {
    setTranscriptionText(
      isFullTranscription ? stop.transcription : transcriptionFirstParagraph
    );
  }, [isFullTranscription]);

  return (
    <Space
      className="flex flex--wrap"
      v={{ size: 'xl', properties: ['margin-bottom'] }}
    >
      <TitleTombstone>
        <h2 className="h2">{stop.title}</h2>
        <PrismicHtmlBlock html={stop.tombstone} />
      </TitleTombstone>
      <CaptionTranscription>
        <Caption>
          {stop.image?.contentUrl && (
            <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
              <PrismicImageWrapper>
                <PrismicImage image={stop.image} sizes={{}} quality={`low`} />
              </PrismicImageWrapper>
            </Space>
          )}
          <PrismicHtmlBlock html={stop.caption} />
        </Caption>
        {transcriptionText && (
          <Transcription>
            <h3 className={font('wb', 5)}>
              {stop.number ? `Stop ${stop.number}: ` : ''}Audio transcript
            </h3>
            <div id="transcription-text">
              <PrismicHtmlBlock
                html={transcriptionText as prismicT.RichTextField}
              />
            </div>
            {hasShowFullTranscriptionButton && (
              <ButtonOutlined
                ariaControls="transcription-text"
                ariaExpanded={isFullTranscription}
                clickHandler={() => {
                  setIsFullTranscription(!isFullTranscription);
                }}
                text={
                  isFullTranscription
                    ? 'Hide full transcript'
                    : 'Read full transcript'
                }
              />
            )}
          </Transcription>
        )}
      </CaptionTranscription>
    </Space>
  );
};

const ExhibitionCaptions: FC<Props> = ({ stops }) => {
  return (
    <ul className="plain-list no-margin no-padding">
      {stops.map((stop, index) => (
        <Stop key={index} stop={stop} />
      ))}
    </ul>
  );
};

export default ExhibitionCaptions;
