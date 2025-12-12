import { SliceComponentProps } from '@prismicio/react';
import { FunctionComponent } from 'react';

import { AudioPlayerSlice as RawAudioPlayerSlice } from '@weco/common/prismicio-types';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper';
import { ContaineredLayout } from '@weco/common/views/components/Layout';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import { transformAudioPlayerSlice } from '@weco/content/services/prismic/transformers/body';
import AudioPlayer from '@weco/content/views/components/AudioPlayer';
import { SliceZoneContext } from '@weco/content/views/components/Body';

export type AudioPlayerProps = SliceComponentProps<
  RawAudioPlayerSlice,
  SliceZoneContext
>;

const AudioPlayerSlice: FunctionComponent<AudioPlayerProps> = ({
  slice,
  context,
}) => {
  const transformedSlice = transformAudioPlayerSlice(slice);
  return (
    <SpacingComponent $sliceType={transformedSlice.type}>
      <ConditionalWrapper
        condition={!!context.gridSizes}
        wrapper={children => (
          <ContaineredLayout gridSizes={context.gridSizes!}>
            {children}
          </ContaineredLayout>
        )}
      >
        <AudioPlayer {...transformedSlice.value} />
      </ConditionalWrapper>
    </SpacingComponent>
  );
};

export default AudioPlayerSlice;
