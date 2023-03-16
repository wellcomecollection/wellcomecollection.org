import { FunctionComponent, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import * as prismicT from '@prismicio/types';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import { font } from '@weco/common/utils/classnames';
import { themeValues, PaletteColor } from '@weco/common/views/themes/config';
import { dasherizeShorten } from '@weco/common/utils/grammar';
import ZoomedPrismicImage from '../ZoomedPrismicImage/ZoomedPrismicImage';
import {
  ExhibitionGuideComponent,
  ExhibitionGuideType,
} from 'types/exhibition-guides';
import { isNotUndefined } from '@weco/common/utils/array';

export function getTypeColor(type: ExhibitionGuideType): PaletteColor {
  switch (type) {
    case 'bsl':
      return 'accent.lightBlue';
    case 'audio-without-descriptions':
      return 'accent.lightSalmon';
    case 'audio-with-descriptions':
      return 'accent.lightPurple';
    case 'captions-and-transcripts':
    default:
      return 'accent.lightGreen';
  }
}

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
    props.theme.color(getTypeColor('captions-and-transcripts'))};
`;

const ContextTitle = styled(Space).attrs<{ level: number }>(props => ({
  as: `h${props.level}`,
  className: font('wb', 3),
  v: { size: 'm', properties: ['margin-bottom'] },
}))<{ level: number }>``;

const TranscriptTitle = styled(Space).attrs<{ level: number }>(props => ({
  as: `h${props.level}`,
  className: font('wb', 4),
  v: { size: 'm', properties: ['margin-bottom'] },
}))<{ level: number }>``;

const ContextContainer = styled(Space).attrs<{ hasPadding: boolean }>(
  props => ({
    v: props.hasPadding
      ? { size: 'xl', properties: ['padding-top', 'padding-bottom'] }
      : null,
  })
)<{ backgroundColor: PaletteColor; hasPadding: boolean }>`
  background: ${props => props.theme.color(props.backgroundColor)};
`;

const TombstoneTitle = styled(Space).attrs<{ level: number }>(props => ({
  as: `h${props.level}`,
  className: font('wb', 3),
  v: { size: 's', properties: ['margin-bottom'] },
}))<{ level: number }>``;

const Tombstone = styled(Space).attrs({
  className: font('intr', 4),
  h: { size: 'l', properties: ['padding-right'] },
})`
  flex-basis: 100%;
  margin-bottom: 1em;

  ${props => props.theme.media('medium')`
    flex-basis: 40%;
    margin-bottom: 0;
  `}

  ${props => props.theme.media('large')`
    flex-basis: 30%;
  `}

  p {
    margin-bottom: 0;
  }
`;

const CaptionTranscription = styled.div`
  flex-basis: 100%;
  max-width: 45em;

  ${props => props.theme.media('medium')`
    flex-basis: 60%;
  `}

  ${props => props.theme.media('large')`
    flex-basis: 70%;
  `}
`;

const Caption = styled(Space).attrs({
  className: `spaced-text ${font('intr', 5)}`,
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 20px solid ${props => props.theme.color('lightYellow')};
`;

const PrismicImageWrapper = styled.div`
  position: relative;
  max-width: 600px;
`;

const Transcription = styled(Space).attrs({
  className: `spaced-text ${font('intr', 5)}`,
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  v: { size: 'l', properties: ['margin-top'] },
})`
  border-left: 20px solid ${props => props.theme.color('accent.lightBlue')};
`;

type Props = {
  stops: ExhibitionGuideComponent[];
};

function includesStandaloneTitle(stop: ExhibitionGuideComponent): boolean {
  return stop.captionsOrTranscripts
    ? stop.captionsOrTranscripts.standaloneTitle.length > 0
    : false;
}

type TitlesUsed = {
  standalone: boolean;
  context: boolean;
};

function calculateTombstoneHeadingLevel(titlesUsed: TitlesUsed): number {
  if (titlesUsed.standalone && titlesUsed.context) {
    return 4;
  } else if (titlesUsed.standalone || titlesUsed.context) {
    return 3;
  } else {
    return 2;
  }
}

const Stop: FunctionComponent<{
  index: number;
  stop: ExhibitionGuideComponent;
  isFirstStop: boolean;
  titlesUsed: TitlesUsed;
}> = ({ index, stop, isFirstStop, titlesUsed }) => {
  const { image } = stop;

  // We know the captions-or-transcripts data will be defined, because the
  // Prismic transformer filters out any stops which don't have this data.
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const captionsOrTranscripts = stop.captionsOrTranscripts!;

  const { title, standaloneTitle, tombstone, caption, context, transcription } =
    captionsOrTranscripts;

  const { isEnhanced } = useContext(AppContext);
  const hasShowFullTranscriptionButton =
    (transcription?.length || 0) > 1 && isEnhanced; // We only show the button if there is more than one paragraph
  const transcriptionFirstParagraph = transcription?.slice(0, 1);
  const [isFullTranscription, setIsFullTranscription] = useState(true);
  const [transcriptionText, setTranscriptionText] = useState(
    transcriptionFirstParagraph
  );
  const hasContext = isNotUndefined(context);
  const hasStandaloneTitle = includesStandaloneTitle(stop);

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

  // Heading levels will vary depending on the inclusion of optional headings on the page
  const contextHeadingLevel = titlesUsed.standalone ? 3 : 2;
  const tombstoneHeadingLevel = calculateTombstoneHeadingLevel(titlesUsed);
  const audioTranscriptHeadingLevel = tombstoneHeadingLevel + 1;

  return (
    <>
      {hasStandaloneTitle && (
        <div className="container">
          {!isFirstStop && (
            <Space
              v={{
                size: 'xl',
                properties: ['margin-bottom'],
              }}
            ></Space>
          )}
          <div className="flex flex--wrap">
            <Tombstone />
            {/* This empty Tombstone is needed for correct alignment of the standaloneTitle */}
            <Space
              h={{
                size: 'm',
                properties: ['margin-left'],
                negative: true,
              }}
              v={{ size: 'l', properties: ['margin-bottom'] }}
            >
              <StandaloneTitle
                id={`${dasherizeShorten(`${standaloneTitle}`)}-${index}`}
              >
                {standaloneTitle}
              </StandaloneTitle>
            </Space>
          </div>
        </div>
      )}
      <Space v={{ size: 'xl', properties: ['margin-bottom'] }}>
        <ConditionalWrapper
          condition={hasContext}
          wrapper={children => (
            <ContextContainer
              backgroundColor={isFirstStop ? 'white' : 'warmNeutral.300'}
              hasPadding={!isFirstStop}
            >
              {children}
            </ContextContainer>
          )}
        >
          <div className="flex flex--wrap container">
            <Tombstone>
              {!hasContext && title && (
                <TombstoneTitle
                  level={tombstoneHeadingLevel}
                  id={`${dasherizeShorten(`${title}`)}-${index}`}
                >
                  {title}
                </TombstoneTitle>
              )}
              {tombstone && (
                <div className={font('intr', 4)}>
                  <PrismicHtmlBlock html={tombstone} />
                </div>
              )}
            </Tombstone>

            <CaptionTranscription>
              {hasContext && (
                <>
                  {title.length > 0 && (
                    <ContextTitle
                      id={`${dasherizeShorten(`${title}`)}-c${index}`}
                      level={contextHeadingLevel}
                    >
                      {title}
                    </ContextTitle>
                  )}
                  <PrismicHtmlBlock html={context as prismicT.RichTextField} />
                </>
              )}

              {caption && (
                <Caption>
                  {image?.contentUrl && (
                    <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                      <PrismicImageWrapper>
                        <ZoomedPrismicImage image={image} />
                        <PrismicImage image={image} sizes={{}} quality="low" />
                      </PrismicImageWrapper>
                    </Space>
                  )}
                  <PrismicHtmlBlock html={caption} />
                </Caption>
              )}
              {transcriptionText && transcriptionText.length > 0 && (
                <Transcription>
                  <TranscriptTitle level={audioTranscriptHeadingLevel}>
                    {stop.number ? `Stop ${stop.number}: ` : ''}Audio transcript
                  </TranscriptTitle>
                  <div id={`transcription-text-${index}`}>
                    <PrismicHtmlBlock
                      html={transcriptionText as prismicT.RichTextField}
                    />
                  </div>
                  {hasShowFullTranscriptionButton && (
                    <ButtonSolid
                      colors={
                        hasContext
                          ? themeValues.buttonColors.charcoalTransparentCharcoal
                          : themeValues.buttonColors.greenTransparentGreen
                      }
                      ariaControls={`transcription-text-${index}`}
                      ariaExpanded={isFullTranscription}
                      clickHandler={() => {
                        setIsFullTranscription(!isFullTranscription);
                      }}
                      trackingEvent={{
                        category: 'ExhibitionCaptions',
                        action: 'read full transcript',
                        label: stop.anchorId,
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

const ExhibitionCaptions: FunctionComponent<Props> = ({ stops }) => {
  const titlesUsed = {
    standalone: false,
    context: false,
  };

  return (
    <article>
      {stops.map((stop, index) => {
        // We want to know whether a standalone title and/or a context title has been used
        // so we can decrease subsequent headings to the appropriate level
        if (!titlesUsed.standalone) {
          titlesUsed.standalone = includesStandaloneTitle(stop);
        }
        if (!titlesUsed.context) {
          titlesUsed.context = isNotUndefined(
            stop.captionsOrTranscripts?.context
          );
        }
        return (
          <Stop
            key={index}
            index={index}
            stop={stop}
            isFirstStop={index === 0}
            titlesUsed={titlesUsed}
          />
        );
      })}
    </article>
  );
};

export default ExhibitionCaptions;
