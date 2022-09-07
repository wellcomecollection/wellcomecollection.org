import { FC, useState, useContext, useEffect } from 'react';
import styled from 'styled-components';
import Space from '@weco/common/views/components/styled/Space';
import PrismicHtmlBlock from '@weco/common/views/components/PrismicHtmlBlock/PrismicHtmlBlock';
import * as prismicT from '@prismicio/types';
import { ImageType } from '@weco/common/model/image';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import ButtonSolid from '@weco/common/views/components/ButtonSolid/ButtonSolid';
import { AppContext } from '@weco/common/views/components/AppContext/AppContext';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';
import Divider from '@weco/common/views/components/Divider/Divider';
import { font } from '@weco/common/utils/classnames';
import { themeValues } from '@weco/common/views/themes/config';
import { dasherize } from '@weco/common/utils/grammar';

function getTypeColor(type: string): string {
  // importing this from exhibition-guide.tsx was causing a storybook build failure
  // need to investigate why, but am duplicating the function here for now
  // in order to get the exhibition guides work deployed
  switch (type) {
    case 'bsl':
      return 'newPaletteBlue';
    case 'audio-without-descriptions':
      return 'newPaletteOrange';
    case 'audio-with-descriptions':
      return 'newPaletteSalmon';
    case 'captions-and-transcripts':
      return 'newPaletteMint';
    default:
      return 'newPaletteMint';
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

const ContextContainer = styled(Space).attrs<{ hasPadding: boolean }>(
  props => ({
    v: props.hasPadding
      ? { size: 'xl', properties: ['padding-top', 'padding-bottom'] }
      : null,
  })
)<{ backgroundColor: string; backgroundShade: string; hasPadding: boolean }>`
  background: ${props =>
    props.theme.color(props.backgroundColor, props.backgroundShade)};
`;

const TombstoneTitle = styled(Space).attrs({
  as: 'h2',
  className: font('wb', 3),
  v: { size: 's', properties: ['margin-bottom'] },
})``;

const Tombstone = styled(Space).attrs({
  h: { size: 'm', properties: ['padding-right'] },
})`
  flex-basis: 100%;
  margin-bottom: 1em;

  ${props => props.theme.media.medium`
    flex-basis: 40%;
    margin-bottom: 0;
  `}

  ${props => props.theme.media.large`
    flex-basis: 25%;
  `}

  p {
    margin-bottom: 0;
  }
`;

const CaptionTranscription = styled.div.attrs({
  className: 'spaced-text',
})`
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
  className: `spaced-text ${font('intr', 5)}`,
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 20px solid ${props => props.theme.color('yellow')};
`;

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
  tombstone: prismicT.RichTextField;
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
  const hasContext = Boolean(context && context.length > 0);

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
            <Tombstone />
            {/* This empty Tombstone is needed for correct alignmennt of the standaloneTitle */}
            <Space
              h={{
                size: 'm',
                properties: ['margin-left'],
                negative: true,
              }}
              v={{ size: 'l', properties: ['margin-bottom'] }}
            >
              <StandaloneTitle id={dasherize(`${standaloneTitle}`)}>
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
              backgroundColor={isFirstStop ? 'white' : 'cream'}
              backgroundShade={isFirstStop ? 'base' : 'light'}
              hasPadding={!isFirstStop}
            >
              {children}
            </ContextContainer>
          )}
        >
          <div className="flex flex--wrap container">
            <Tombstone>
              <TombstoneTitle id={dasherize(`${title}`)}>
                {!hasContext && title}
              </TombstoneTitle>
              <div className={font('intr', 4)}>
                <PrismicHtmlBlock html={tombstone} />
              </div>
            </Tombstone>

            <CaptionTranscription>
              {isFirstStop && hasContext && title.length > 0 && (
                <Space
                  h={{
                    size: 'm',
                    properties: ['margin-left'],
                    negative: true,
                  }}
                  v={{ size: 'l', properties: ['margin-bottom'] }}
                >
                  <StandaloneTitle id={dasherize(title)}>
                    {title}
                  </StandaloneTitle>
                </Space>
              )}

              {hasContext && (
                <>
                  {!isFirstStop && title.length > 0 && (
                    <ContextTitle id={dasherize(title)}>{title}</ContextTitle>
                  )}
                  <PrismicHtmlBlock html={context as prismicT.RichTextField} />
                </>
              )}

              {caption.length > 0 && (
                <Caption>
                  {image?.contentUrl && (
                    <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
                      <PrismicImageWrapper>
                        <PrismicImage
                          image={image}
                          sizes={{}}
                          quality={`low`}
                        />
                      </PrismicImageWrapper>
                    </Space>
                  )}
                  <PrismicHtmlBlock html={caption} />
                </Caption>
              )}
              {transcriptionText && transcriptionText.length > 0 && (
                <Transcription>
                  <TranscriptTitle>
                    {stop.number ? `Stop ${stop.number}: ` : ''}Audio transcript
                  </TranscriptTitle>
                  <div id="transcription-text">
                    <PrismicHtmlBlock
                      html={transcriptionText as prismicT.RichTextField}
                    />
                  </div>
                  {hasShowFullTranscriptionButton && (
                    <ButtonSolid
                      colors={themeValues.buttonColors.greenTransparentGreen}
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
