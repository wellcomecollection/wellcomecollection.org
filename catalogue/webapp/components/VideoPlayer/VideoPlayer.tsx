import { trackGaEvent } from '@weco/common/utils/ga';
import { FunctionComponent, useState, SyntheticEvent } from 'react';
import MediaAnnotations from '../MediaAnnotations/MediaAnnotations';
import { Video } from '../../services/iiif/types/manifest/v3';

type Props = {
  video: Video;
  showDownloadOptions: boolean;
};

const VideoPlayer: FunctionComponent<Props> = ({
  video,
  showDownloadOptions,
}: Props) => {
  const [didStart, setDidStart] = useState(false);

  function getParams(
    event: SyntheticEvent<HTMLVideoElement, Event>,
    cachedSteps: Set<number>
  ) {
    return {
      video_current_time: event.currentTarget.currentTime,
      video_duration: event.currentTarget.duration,
      video_percent: [...cachedSteps].pop(),
      video_provider: 'IIIF',
      video_title: 'IIIF',
      video_url: event.currentTarget.src,
    };
  }

  const cachedSteps: Set<number> = new Set();
  const progressSteps = [10, 25, 50, 75, 90];

  function trackPlay(event: SyntheticEvent<HTMLVideoElement, Event>) {
    if (didStart) return;

    gtag('event', 'video_start', getParams(event, cachedSteps));

    setDidStart(true);
  }

  function trackEnded(event: SyntheticEvent<HTMLVideoElement, Event>) {
    gtag('event', 'video_complete', getParams(event, cachedSteps));
    setDidStart(false);
  }

  function trackProgress(event: SyntheticEvent<HTMLVideoElement, Event>) {
    const currentTime = event.currentTarget.currentTime;
    const duration = event.currentTarget.duration;
    const percentComplete = (currentTime / duration) * 100;
    const currentPercent = progressSteps
      .filter(step => percentComplete >= step)
      .at(-1);

    if (currentPercent && !cachedSteps.has(currentPercent)) {
      gtag('event', 'video_progress', getParams(event, cachedSteps));
      cachedSteps.add(currentPercent);
    }
  }

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
        onProgress={trackProgress}
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
