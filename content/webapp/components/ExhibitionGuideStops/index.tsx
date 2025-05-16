import { FunctionComponent, ReactElement } from 'react';
import styled from 'styled-components';

import { useToggles } from '@weco/common/server-data/Context';
import { font } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import { PaletteColor } from '@weco/common/views/themes/config';
import AudioPlayer from '@weco/content/components/AudioPlayer';
import AudioPlayerNew from '@weco/content/components/AudioPlayerNew';
import GridFactory, {
  threeUpGridSizesMap,
  twoUpGridSizesMap,
} from '@weco/content/components/Body/GridFactory';
import ExhibitionCaptions from '@weco/content/components/ExhibitionCaptions';
import {
  ExhibitionGuideComponent,
  ExhibitionGuideType,
} from '@weco/content/types/exhibition-guides';

export const Stop = styled(Space).attrs({
  $v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  $h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})<{ $backgroundColor?: PaletteColor }>`
  background: ${props =>
    props.theme.color(props.$backgroundColor || 'warmNeutral.300')};
  height: 100%;
`;

const VideoPlayerWrapper = styled.figure`
  margin: 0;
`;

type VideoPlayerProps = {
  title: string;
  videoUrl: string;
  videoProvider: 'YouTube' | 'Vimeo';
  videoThumbnail?: string;
  titleProps: { role: string; 'aria-level': number };
};

export const VideoPlayer: FunctionComponent<VideoPlayerProps> = ({
  title,
  videoUrl,
  videoProvider,
  videoThumbnail,
  titleProps,
}) => (
  <VideoPlayerWrapper>
    <Space $v={{ size: 'm', properties: ['margin-bottom'] }}>
      <figcaption className={font('intb', 5)} {...titleProps}>
        {title}
      </figcaption>
    </Space>
    <VideoEmbed
      embedUrl={videoUrl}
      videoProvider={videoProvider}
      videoThumbnail={videoThumbnail}
    />
  </VideoPlayerWrapper>
);

type Props = {
  stops: ExhibitionGuideComponent[];
  type: ExhibitionGuideType;
};

export const Stops: FunctionComponent<Props> = ({ stops, type }) => {
  const { audioPlayer } = useToggles();

  return (
    <GridFactory
      overrideGridSizes={
        type === 'bsl' || (type === 'audio-without-descriptions' && audioPlayer)
          ? twoUpGridSizesMap
          : threeUpGridSizesMap
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
                $backgroundColor={
                  type === 'audio-without-descriptions' && audioPlayer
                    ? 'white'
                    : undefined
                }
              >
                {type === 'audio-without-descriptions' &&
                  audioWithoutDescription?.url && (
                    <>
                      {audioPlayer ? (
                        <AudioPlayerNew
                          audioFile={audioWithoutDescription.url}
                          title={stopTitle}
                          titleProps={titleProps}
                          // isDark
                        />
                      ) : (
                        <AudioPlayer
                          title={stopTitle}
                          titleProps={titleProps}
                          audioFile={audioWithoutDescription.url}
                        />
                      )}
                    </>
                  )}
                {type === 'bsl' && bsl && (
                  <VideoPlayer
                    title={stopTitle}
                    titleProps={titleProps}
                    videoUrl={bsl.embedUrl}
                    videoProvider={bsl.provider}
                    videoThumbnail={bsl.thumbnail}
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
