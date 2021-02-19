// @flow
import { useState, useEffect, useRef } from 'react';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import Tasl from '../Tasl/Tasl';
// $FlowFixMe (tsx)
import Caption from '../Caption/Caption';
import type { HTMLString } from '../../../services/prismic/types';
import type { Tasl as TaslType } from '../../../model/tasl';
type Props = {|
  playbackRate: number,
  videoUrl: string,
  caption: ?HTMLString,
  tasl: ?TaslType,
  autoPlay: boolean,
  loop: boolean,
  mute: boolean,
  showControls: boolean,
|};

const inViewport = (video: HTMLElement) => {
  const rect = video.getBoundingClientRect();
  return (
    rect.top >= 0 - rect.height &&
    rect.top <= window.innerHeight &&
    rect.left >= 0 &&
    rect.left < window.innerWidth
  );
};

const GifVideo = ({
  playbackRate,
  videoUrl,
  caption,
  tasl,
  autoPlay,
  loop,
  mute,
  showControls,
}: Props) => {
  const [canPlay, setCanPlay] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [autoPlayDisabled, setAutoPlayDisabled] = useState(
    !mute ? true : !autoPlay // we never want to autoplay something with audio on
  );
  const [computedVideoWidth, setComputedVideoWidth] = useState(null);
  const videoRef = useRef(null);
  const canPlayRef = useRef();
  canPlayRef.current = canPlay;

  const playVideo = (video: HTMLMediaElement) => {
    setIsPlaying(true);
    video.play();
  };

  const pauseVideo = (video: HTMLMediaElement) => {
    setIsPlaying(false);
    video.pause();
  };

  const autoControlGif = () => {
    const video = videoRef.current;
    const inViewAndPlayable = video && inViewport(video) && canPlayRef.current;
    if (video) {
      if (!autoPlayDisabled) {
        if (inViewAndPlayable) {
          playVideo(video);
        } else {
          pauseVideo(video);
        }
      }
    }
  };

  const computeVideoWidth = () => {
    const computedVideoWidth = videoRef?.current?.clientWidth;
    setComputedVideoWidth(computedVideoWidth);
  };

  const manualControlGif = () => {
    const video = videoRef.current;
    if (video) {
      if (!isPlaying) {
        setAutoPlayDisabled(false);
        playVideo(video);
      } else {
        setAutoPlayDisabled(true);
        pauseVideo(video);
      }
    }
    trackEvent({
      category: 'GifVideo',
      action: isPlaying ? 'pause video' : 'play video',
      label: videoUrl,
    });
  };

  useEffect(() => {
    autoControlGif();
    computeVideoWidth();
  }, [canPlay]);

  const debounceAutoControl = debounce(autoControlGif, 500);
  const throttleAutoControl = throttle(autoControlGif, 100);
  const debounceComputeVideoWidth = debounce(computeVideoWidth, 500);

  useEffect(() => {
    const video = videoRef.current;

    if (video) {
      video.playbackRate = playbackRate;

      if (video.readyState > 3) {
        setCanPlay(true);
      } else {
        video.addEventListener('loadedmetadata', () => {
          setCanPlay(true);
        });
      }
    }

    window.addEventListener('resize', debounceAutoControl);
    window.addEventListener('resize', debounceComputeVideoWidth);
    window.addEventListener('scroll', throttleAutoControl);

    return () => {
      window.removeEventListener('resize', debounceAutoControl);
      window.removeEventListener('resize', debounceComputeVideoWidth);
      window.removeEventListener('scroll', throttleAutoControl);
    };
  }, []);

  return (
    <figure className="gif-video no-margin text-align-center">
      <div className="gif-video__inner relative inline-block">
        <video
          ref={videoRef}
          className="gif-video__video block"
          preload="metadata"
          muted={mute}
          loop={loop}
          controls={showControls}
          playsInline
        >
          <source src={`${videoUrl}#t=0.1`} type="video/mp4" />
          <p>{"Your browser doesn't support video"}</p>
        </video>
        {canPlay && !showControls && (
          <button
            className={classNames({
              'no-margin no-padding plain-button gif-video__play-pause absolute': true,
            })}
            aria-label="play/pause button"
            onClick={manualControlGif}
          >
            <span
              className={classNames({
                [font('lr', 5)]: true,
                'gif-video__text block': true,
                'gif-video__text--is-playing': isPlaying,
              })}
            />
          </button>
        )}
        {tasl &&
          (tasl.title ||
            tasl.sourceName ||
            tasl.copyrightHolder ||
            tasl.license) && <Tasl {...tasl} />}
      </div>
      {caption && <Caption width={computedVideoWidth} caption={caption} />}
    </figure>
  );
};

export default GifVideo;
