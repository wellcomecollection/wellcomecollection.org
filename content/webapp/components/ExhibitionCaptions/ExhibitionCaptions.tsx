import { FC, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import * as prismicT from '@prismicio/types';
import { ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import ButtonOutlined from '@weco/common/views/components/ButtonOutlined/ButtonOutlined';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import Divider from '@weco/common/views/components/Divider/Divider';
import { font } from '@weco/common/utils/classnames';
import { guideColours } from '../../pages/exhibition-guide';

const StandaloneTitle = styled(Space).attrs({
  as: 'h2',
  v: {
    size: 'm',
    properties: ['padding-top', 'padding-bottom', 'margin-bottom'],
  },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  className: `${font('wb', 2)} no-margin`,
})`
  display: inline-block;
  position: relative;

  background: ${props =>
    props.theme.color(guideColours['captions-and-transcripts'])};
`;

const ContextTitle = styled(Space).attrs({
  as: 'h2',
  className: font('wb', 3),
  v: { size: 'm', properties: ['margin-bottom'] },
})``;

const TranscriptTitle = styled(Space).attrs({
  as: 'h3',
  className: font('wb', 4),
  v: { size: 'm', properties: ['margin-bottom'] },
})``;

const ContextContainer = styled(Space).attrs<{ hasTopPadding: boolean }>(
  props => ({
    v: props.hasTopPadding ? { size: 'l', properties: ['padding-top'] } : null,
  })
)<{ backgroundColor: string; backgroundShade: string; hasTopPadding: boolean }>`
  background: ${props =>
    props.theme.color(props.backgroundColor, props.backgroundShade)};
`;

const TitleTombstone = styled(Space).attrs({
  className: 'spaced-text',
  h: { size: 'm', properties: ['padding-right'] },
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
  className: `spaced-text ${font('hnr', 5)}`,
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 20px solid ${props => props.theme.color('yellow')};
`;
// TODO thicker coloured lines
const PrismicImageWrapper = styled.div`
  max-width: 600px;
`;

const Transcription = styled(Space).attrs({
  className: 'spaced-text',
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['margin-top'] },
})`
  border-left: 20px solid ${props => props.theme.color('newPaletteBlue')};
`;

type Stop = {
  standaloneTitle: prismicT.RichTextField;
  number: number;
  title: string;
  image?: ImageType;
  tombstone: prismicT.RichTextField; // TODO transforms?
  caption: prismicT.RichTextField;
  context?: prismicT.RichTextField;
  transcription?: prismicT.RichTextField;
};

type Props = {
  stops: Stop[];
};

const Stop: FC<{ stop: Stop; isFirstStop: boolean }> = ({
  stop,
  isFirstStop,
}) => {
  const {
    standaloneTitle,
    number,
    title,
    image,
    tombstone,
    caption,
    context,
    transcription,
  } = stop;
  const { isEnhanced } = useContext(AppContext);
  const hasShowFullTranscriptionButton =
    (stop.transcription?.length || 0) > 1 && isEnhanced; // We only show the button if there is more than one paragraph
  const transcriptionFirstParagraph = transcription?.slice(0, 1);
  const [isFullTranscription, setIsFullTranscription] = useState(true);
  const [transcriptionText, setTranscriptionText] = useState(
    transcriptionFirstParagraph
  );
  const hasContext = Boolean(context && context.length > 0); // TODO better way to check? // TODO is context really optional?

  useEffect(() => {
    // Show full audio transcripts by default and hide them once we know
    // JavaScript is available
    setIsFullTranscription(false);
  }, []);

  useEffect(() => {
    setTranscriptionText(
      isFullTranscription ? transcription : transcriptionFirstParagraph
    );
  }, [isFullTranscription]);

  return (
    <>
      {standaloneTitle.length > 0 && (
        <div className="container">
          <Space
            v={{
              size: 'xl',
              properties: ['margin-bottom'],
            }}
          >
            <Divider color={`pumice`} isKeyline={true} />
          </Space>
          <div className="flex flex--wrap">
            <TitleTombstone />
            {/* This empty TitleTombstone is needed for correct alignmennt of the standaloneTitle */}
            <Space
              h={{
                size: 'm',
                properties: ['margin-left'],
                negative: true,
              }}
              v={{ size: 'l', properties: ['margin-bottom'] }}
            >
              <StandaloneTitle>{standaloneTitle}</StandaloneTitle>
            </Space>
          </div>
        </div>
      )}
      <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
        <ConditionalWrapper
          condition={hasContext}
          wrapper={children => (
            <ContextContainer
              backgroundColor={isFirstStop ? 'white' : 'cream'}
              backgroundShade={isFirstStop ? 'base' : 'light'}
              hasTopPadding={!isFirstStop}
            >
              {children}
            </ContextContainer>
          )}
        >
          <div className="flex flex--wrap container">
            <TitleTombstone>
              <h2 className={font('wb', 4)}>
                {number ? `${number}. ` : ''}
                {!hasContext && title}
              </h2>
              <PrismicHtmlBlock html={tombstone} />
            </TitleTombstone>
            {/* // TODO rename CaptionTranscription */}
            <CaptionTranscription>
              {isFirstStop && title.length > 0 && (
                <Space
                  h={{
                    size: 'm',
                    properties: ['margin-left'],
                    negative: true,
                  }}
                  v={{ size: 'l', properties: ['margin-bottom'] }}
                >
                  <StandaloneTitle>{title}</StandaloneTitle>
                </Space>
              )}

              {hasContext && (
                <>
                  {!isFirstStop && title.length > 0 && (
                    <ContextTitle>{title}</ContextTitle>
                  )}
                  <PrismicHtmlBlock html={context as prismicT.RichTextField} />
                </>
              )}

              <Caption>
                {image?.contentUrl && (
                  <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                    <PrismicImageWrapper>
                      <PrismicImage image={image} sizes={{}} quality={`low`} />
                    </PrismicImageWrapper>
                  </Space>
                )}
                <PrismicHtmlBlock html={caption} />
              </Caption>
              {transcriptionText && transcriptionText.length > 0 && (
                <Transcription>
                  <TranscriptTitle>Audio transcript</TranscriptTitle>
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
          </div>
        </ConditionalWrapper>
      </Space>
    </>
  );
};

const ExhibitionCaptions: FC<Props> = ({ stops }) => {
  return (
    <ul className="plain-list no-margin no-padding">
      {stops.map((stop, index) => (
        <Stop key={index} stop={stop} isFirstStop={index === 0} />
      ))}
    </ul>
  );
};

export default ExhibitionCaptions;
