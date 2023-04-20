import Router from 'next/router';
import { trackGaEvent } from '@weco/common/utils/ga';
import {
  FunctionComponent,
  useEffect,
  useState,
  SyntheticEvent,
  cache,
} from 'react';
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
  // {Audio/Video} Current Time (HTMLMediaElement.currentTime)
  // {Audio/Video} Duration (HTMLMediaElement.duration)
  // {Audio/Video} Percent (duration / currentTime)
  // {Audio/Video} Provider (static)
  // {Audio/Video} Status (?)
  // {Audio/Video} Title (static)
  // {Audio/Video} URL (static)

  const cachedSteps = new Set();
  const progressSteps = [10, 25, 50, 75, 90];

  function trackPlay(event: SyntheticEvent<HTMLVideoElement, Event>) {
    console.log('play');
    // TODO: send GA4 video_start event here (only if you're at zero seconds?)
  }

  function trackEnded(event: SyntheticEvent<HTMLVideoElement, Event>) {
    console.log('ended');
    // TODO: send GA4 video_complete event here
  }

  function trackProgress(event: SyntheticEvent<HTMLVideoElement, Event>) {
    const currentTime = event.currentTarget.currentTime;
    const duration = event.currentTarget.duration;
    const percentComplete = (currentTime / duration) * 100;
    const currentPercent = progressSteps
      .filter(step => percentComplete >= step)
      .at(-1);

    if (currentPercent && !cachedSteps.has(currentPercent)) {
      // TODO: send GA4 video_progress event here
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
