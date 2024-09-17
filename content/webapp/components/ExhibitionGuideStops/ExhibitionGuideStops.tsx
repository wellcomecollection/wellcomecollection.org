import { ReactElement, FunctionComponent } from 'react';
import styled from 'styled-components';
import {
  ExhibitionGuideComponent,
  ExhibitionGuideType,
} from '@weco/content/types/exhibition-guides';
import Space from '@weco/common/views/components/styled/Space';
import ExhibitionCaptions from '@weco/content/components/ExhibitionCaptions/ExhibitionCaptions';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import GridFactory, {
  threeUpGridSizesMap,
  twoUpGridSizesMap,
} from '@weco/content/components/Body/GridFactory';
import { font } from '@weco/common/utils/classnames';

export const Stop = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
  height: 100%;
`;

const VideoPlayerWrapper = styled.figure`
  margin: 0;
`;

type VideoPlayerProps = {
  title: string;
  videoUrl: string;
  titleProps: { role: string; 'aria-level': number };
};

export const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({
  title,
  videoUrl,
  titleProps,
}) => (
  <VideoPlayerWrapper>
    <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
      <figcaption className={font('intb', 5)} {...titleProps}>
        {title}
      </figcaption>
    </Space>
    <VideoEmbed embedUrl={videoUrl} />
  </VideoPlayerWrapper>
);

type Props = {
  stops: ExhibitionGuideComponent[];
  type: ExhibitionGuideType;
};

export const Stops: FunctionComponent<Props> = ({ stops, type }) => {
  return (
    <GridFactory
      overrideGridSizes={
        type === 'bsl' ? twoUpGridSizesMap : threeUpGridSizesMap
      }
      items={
        stops
          .map((stop, index) => {
            const {
              number,
              audioWithoutDescription,
              bsl,
              displayTitle,
              anchorId,
            } = stop;
            const hasContentOfDesiredType =
              (type === 'audio-without-descriptions' &&
                audioWithoutDescription?.url) ||
              (type === 'bsl' && bsl?.embedUrl);

            const stopTitle = `${number}. ${displayTitle}`;

            // These props tell screen readers to treat the stop titles as headings,
            // so screen reader users can jump from stop to stop quickly, without
            // having to tab through all the control components.
            const titleProps = {
              role: 'heading',
              'aria-level': 2,
            };

            return hasContentOfDesiredType ? (
              <Stop
                key={index}
                id={anchorId}
                data-toolbar-anchor="apiToolbar"
                // We need tabIndex="-1" so the "Skip to stop" link works for
                // screen readers.
                //
                // See e.g. https://accessibility.oit.ncsu.edu/it-accessibility-at-nc-state/developers/accessibility-handbook/mouse-and-keyboard-events/skip-to-main-content/
                tabIndex={-1}
              >
                {type === 'audio-without-descriptions' &&
                  audioWithoutDescription?.url && (
                    <AudioPlayer
                      title={stopTitle}
                      titleProps={titleProps}
                      audioFile={audioWithoutDescription.url}
                    />
                  )}
                {type === 'bsl' && bsl && (
                  <VideoPlayer
                    title={stopTitle}
                    titleProps={titleProps}
                    videoUrl={bsl.embedUrl}
                  />
                )}
              </Stop>
            ) : null; // We've decided to omit stops that don't have content for the selected type.
          })
          .filter(Boolean) as ReactElement[]
      }
    />
  );
};

const ExhibitionGuideStops: FunctionComponent<Props> = ({ stops, type }) => {
  const numberedStops = stops.filter(c => c.number);
  switch (type) {
    case 'bsl':
    case 'audio-without-descriptions':
      return <Stops stops={numberedStops} type={type} />;
    case 'captions-and-transcripts':
      return <ExhibitionCaptions stops={stops} />;
  }
};

export default ExhibitionGuideStops;
