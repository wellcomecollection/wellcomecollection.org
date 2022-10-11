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
import { dasherizeShorten } from '@weco/common/utils/grammar';

const Stop = styled(Space).attrs({
  v: { size: 'm', properties: ['padding-top', 'padding-bottom'] },
  h: { size: 'm', properties: ['padding-left', 'padding-right'] },
})`
  background: ${props => props.theme.color('warmNeutral.300')};
  height: 100%;
`;

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
              title,
              standaloneTitle,
            } = stop;
            const hasContentOfDesiredType =
              (type === 'audio-with-descriptions' &&
                audioWithDescription?.url) ||
              (type === 'audio-without-descriptions' &&
                audioWithoutDescription?.url) ||
              (type === 'bsl' && bsl?.embedUrl);
            return hasContentOfDesiredType ? (
              <Stop
                key={index}
                id="apiToolbar"
                data-toolbar-anchor={dasherizeShorten(title)}
              >
                {type === 'audio-with-descriptions' &&
                  audioWithDescription?.url && (
                    <AudioPlayer
                      title={
                        stop.title
                          ? `${number}. ${stop.title}`
                          : `${number}. ${standaloneTitle}`
                      }
                      audioFile={audioWithDescription.url}
                    />
                  )}
                {type === 'audio-without-descriptions' &&
                  audioWithoutDescription?.url && (
                    <AudioPlayer
                      title={
                        stop.title
                          ? `${number}. ${stop.title}`
                          : `${number}. ${standaloneTitle}`
                      }
                      audioFile={audioWithoutDescription.url}
                    />
                  )}
                {type === 'bsl' && bsl.embedUrl && (
                  <VideoEmbed embedUrl={bsl.embedUrl} />
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
