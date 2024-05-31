import { FunctionComponent } from 'react';
import AudioPlayer from '@weco/content/components/AudioPlayer/AudioPlayer';
import {
  Stop,
  VideoPlayer,
} from '@weco/content/components/ExhibitionGuideStops/ExhibitionGuideStops';
import { grid } from '@weco/common/utils/classnames';
import Space from '@weco/common/views/components/styled/Space';
import {
  twoUpGridSizesMap,
  threeUpGridSizesMap,
} from '@weco/content/components/Body/GridFactory';

export type Props = {
  number: number | undefined;
  title: string;
  audio: string | undefined;
  video: string | undefined;
  type: string;
};

const GuideMediaStop: FunctionComponent<Props> = ({
  number,
  title,
  audio,
  video,
  type,
}) => {
  const stopTitle = `${number}. ${title}`;
  // These props tell screen readers to treat the stop titles as headings,
  // so screen reader users can jump from stop to stop quickly, without
  // having to tab through all the control components.
  const titleProps = {
    role: 'heading',
    'aria-level': 2,
  };

  return (
    <Space
      $v={{ size: 'l', properties: ['margin-bottom'] }}
      className={grid(
        type === 'bsl'
          ? twoUpGridSizesMap.default[0]
          : threeUpGridSizesMap.default[0]
      )}
    >
      <Stop
        id={number ? `stop-${number}` : undefined}
        data-toolbar-anchor="apiToolbar"
        // We need tabIndex="-1" so the "Skip to stop" link works for
        // screen readers.
        //
        // See e.g. https://accessibility.oit.ncsu.edu/it-accessibility-at-nc-state/developers/accessibility-handbook/mouse-and-keyboard-events/skip-to-main-content/
        tabIndex={-1}
      >
        {type === 'audio-without-descriptions' && (
          <AudioPlayer
            title={stopTitle}
            titleProps={titleProps}
            audioFile={audio || ''}
          />
        )}
        {type === 'bsl' && (
          <VideoPlayer
            title={stopTitle}
            titleProps={titleProps}
            videoUrl={video || ''}
          />
        )}
      </Stop>
    </Space>
  );
};

export default GuideMediaStop;
