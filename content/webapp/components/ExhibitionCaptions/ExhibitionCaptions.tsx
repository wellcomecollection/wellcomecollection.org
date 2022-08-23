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

const StandaloneTitle = styled.h2`
  background: ${props => props.theme.color('newPaletteMint')};
`;
const ContextContainer = styled(Space).attrs({
  v: { size: 'l', properties: ['padding-top'] },
})<{ backgroundColor: string }>`
  background: ${props =>
    props.theme.color(props.backgroundColor)}; // TODO cream light
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
  className: 'spaced-text',
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
  // v: { size: 'l', properties: ['margin-bottom'] },
})`
  border-left: 10px solid ${props => props.theme.color('yellow')};

  :last-child {
    margin-bottom: 0 !important; // why is this not applied?
  }
`;
// TODO thicker coloured lines
const PrismicImageWrapper = styled.div`
  max-width: 600px;
`;

const Transcription = styled(Space).attrs({
  className: 'spaced-text',
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  border-left: 10px solid ${props => props.theme.color('newPaletteBlue')};
`;

type Stop = {
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
  const { number, title, image, tombstone, caption, context, transcription } =
    stop;
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

  // TODO
  // - title fonts
  // all fonts
  // spacing
  // TODO where do the other headers and text come from?
  // TODO exhibition promo text too short ? use exhibition something else?
  return (
    <Space v={{ size: 'l', properties: ['margin-bottom'] }}>
      <ConditionalWrapper
        condition={hasContext}
        wrapper={children => (
          <ContextContainer backgroundColor={isFirstStop ? 'red' : 'brown'}>
            {children}
          </ContextContainer>
        )}
      >
        <div className="flex flex--wrap container">
          <TitleTombstone>
            <h2>
              {number ? `${number}. ` : ''}
              {!hasContext && title}
            </h2>
            <PrismicHtmlBlock html={tombstone} />
          </TitleTombstone>
          {/* // TODO rename CaptionTranscription */}
          <CaptionTranscription>
            {isFirstStop && title.length > 0 && (
              <StandaloneTitle>{title}</StandaloneTitle>
            )}

            {hasContext && (
              <>
                {!isFirstStop && title.length > 0 && <h2>{title}</h2>}
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
                <h3>Audio transcript</h3>
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
