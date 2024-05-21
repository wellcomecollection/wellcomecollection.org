import { Content } from '@prismicio/client';
import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';
import { transformGuideStopSlice } from '@weco/content/services/prismic/transformers/exhibition-highlight-tours';
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

export type GuideStopProps = SliceComponentProps<Content.GuideStopSlice>;

const GuideStop: FunctionComponent<GuideStopProps> = ({
  slice,
  index,
  context,
}) => {
  const transformedSlice = transformGuideStopSlice(slice);
  const { number, title, audio, video } = transformedSlice;
  const stopTitle = `${number}. ${title}`;
  const { type } = context as {
    type: 'bsl' | 'audio-without-descriptions' | 'audio-with-descriptions';
  };
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
      key={index}
      className={grid(
        type === 'bsl'
          ? twoUpGridSizesMap.default[0]
          : threeUpGridSizesMap.default[0]
      )}
    >
      <Stop
        key={index}
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

export default GuideStop;
