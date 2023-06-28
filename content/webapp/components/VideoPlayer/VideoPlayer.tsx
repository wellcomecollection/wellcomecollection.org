import { trackGaEvent } from '@weco/common/utils/ga';
import { FunctionComponent } from 'react';
import MediaAnnotations from '../MediaAnnotations/MediaAnnotations';
import { Video } from '../../services/iiif/types/manifest/v3';
import { useAVTracking } from '@weco/common/hooks/useAVTracking';
type Props = {
  video: Video;
  showDownloadOptions: boolean;
};

const VideoPlayer: FunctionComponent<Props> = ({
  video,
  showDownloadOptions,
}: Props) => {
  const { trackPlay, trackEnded, trackTimeUpdate } = useAVTracking('video');

  return (
    <>
      <video
        onPlay={event => {
          trackPlay(event);
          trackGaEvent({
            category: 'Video',
            action: 'play video',
            label: video.id,
          });
        }}
        onEnded={trackEnded}
        onTimeUpdate={trackTimeUpdate}
        controlsList={!showDownloadOptions ? 'nodownload' : undefined}
        controls
        preload="none"
        poster={video.thumbnail}
        style={{
          maxWidth: '100%',
          maxHeight: '260px',
          display: 'inline-block',
        }}
      >
        <source src={video.id} type={video.format} />
        {`Sorry, your browser doesn't support embedded video.`}
      </video>
      <MediaAnnotations media={video} />
    </>
  );
};

export default VideoPlayer;
