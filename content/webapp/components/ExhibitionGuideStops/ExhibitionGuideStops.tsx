import {
  ExhibitionGuideComponent,
  ExhibitionGuideType,
} from '../../types/exhibition-guides';
import { ReactElement, FC } from 'react';
import Space from '@weco/common/views/components/styled/Space';
import ExhibitionCaptions from '../ExhibitionCaptions/ExhibitionCaptions';
import styled from 'styled-components';
import AudioPlayer from '@weco/common/views/components/AudioPlayer/AudioPlayer';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import GridFactory, {
  threeUpGridSizesMap,
  twoUpGridSizesMap,
} from '@weco/content/components/Body/GridFactory';
import { font } from '@weco/common/utils/classnames';

const Stop = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
  height: 100%;
`;

type VideoPlayerProps = {
  title: string;
  videoUrl: string;
  titleProps: { role: string; 'aria-level': number };
};

const VideoPlayer: FC<VideoPlayerProps> = ({ title, videoUrl, titleProps }) => (
  <figure className="no-margin">
    <Space v={{ size: 'm', properties: ['margin-bottom'] }}>
      <figcaption className={font('intb', 5)} {...titleProps}>
        {title}
      </figcaption>
    </Space>
    <VideoEmbed embedUrl={videoUrl} />
  </figure>
);

type Props = {
  stops: ExhibitionGuideComponent[];
  type: ExhibitionGuideType;
  id?: number;
};

const Stops: FC<Props> = ({ stops, type }) => {
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
              audioWithDescription,
              audioWithoutDescription,
              bsl,
              displayTitle,
              anchorId,
            } = stop;
            const hasContentOfDesiredType =
              (type === 'audio-with-descriptions' &&
                audioWithDescription?.url) ||
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
                {type === 'audio-with-descriptions' &&
                  audioWithDescription?.url && (
                    <AudioPlayer
                      title={stopTitle}
                      titleProps={titleProps}
                      audioFile={audioWithDescription.url}
                    />
                  )}
                {type === 'audio-without-descriptions' &&
                  audioWithoutDescription?.url && (
                    <AudioPlayer
                      title={stopTitle}
                      titleProps={titleProps}
                      audioFile={audioWithoutDescription.url}
                    />
                  )}
                {type === 'bsl' && bsl.embedUrl && (
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

const ExhibitionGuideStops: FC<Props> = ({ stops, type }) => {
  const numberedStops = stops.filter(c => c.number);
  switch (type) {
    case 'bsl':
    case 'audio-with-descriptions':
    case 'audio-without-descriptions':
      return <Stops stops={numberedStops} type={type} />;
    case 'captions-and-transcripts':
      return <ExhibitionCaptions stops={stops} />;
  }
};

export default ExhibitionGuideStops;
