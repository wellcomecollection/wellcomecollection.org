import * as prismic from '@prismicio/client';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { FunctionComponent, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { Tasl as TaslType } from '@weco/common/model/tasl';
import { font } from '@weco/common/utils/classnames';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import Caption from '@weco/common/views/components/Caption';
import FeaturedWorkLink from '@weco/common/views/components/FeaturedWorkLink';
import Tasl from '@weco/common/views/components/Tasl';

const Video = styled.video`
  max-height: 80vh;
  max-width: 100%;
  display: block;
`;

const PlayPause = styled.button.attrs({
  'aria-label': 'play/pause button',
})`
  margin: 0 !important;
  padding: 0;
  position: absolute;
  top: 6px;
  left: 6px;
  transition: opacity 600ms ease;
`;

const Text = styled.span.attrs({
  className: font('lr', 5),
})<{ $isPlaying: boolean }>`
  display: block;
  background: ${props => props.theme.color('neutral.700')};
  padding: 6px;
  border-radius: ${props => props.theme.borderRadiusUnit}px;
  color: ${props => props.theme.color('white')};

  &::before {
    content: '${props => (props.$isPlaying ? 'pause' : 'play')}';
  }
`;

const Figure = styled.figure`
  margin: 0 !important;
  text-align: center;
`;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

export type Props = {
  playbackRate: number;
  videoUrl: string;
  caption?: prismic.RichTextField;
  tasl?: TaslType;
  autoPlay: boolean;
  loop: boolean;
  mute: boolean;
  showControls: boolean;
};

const inViewport = (video: HTMLElement) => {
  const rect = video.getBoundingClientRect();
  return (
    rect.top >= 0 - rect.height &&
    rect.top <= window.innerHeight &&
    rect.left >= 0 &&
    rect.left < window.innerWidth
  );
};

const GifVideo: FunctionComponent<Props> = ({
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
  const [computedVideoWidth, setComputedVideoWidth] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canPlayRef = useRef<boolean>(false);
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
    if (isNotUndefined(computedVideoWidth)) {
      setComputedVideoWidth(computedVideoWidth);
    }
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
  }, [autoPlayDisabled]);

  return (
    <Figure>
      <Wrapper>
        <Video
          ref={videoRef}
          preload="metadata"
          muted={mute}
          loop={loop}
          controls={showControls}
          playsInline
        >
          <source src={`${videoUrl}#t=0.1`} type="video/mp4" />
          <p>Your browser doesn&apos;t support video</p>
        </Video>

        {canPlay && !showControls && (
          <PlayPause onClick={manualControlGif}>
            <Text $isPlaying={isPlaying} />
          </PlayPause>
        )}

        {tasl &&
          (tasl.title ||
            tasl.sourceName ||
            tasl.copyrightHolder ||
            tasl.license) && <Tasl {...tasl} />}
      </Wrapper>

      <FeaturedWorkLink link={tasl?.sourceLink} hasWrapper />

      {caption && <Caption width={computedVideoWidth} caption={caption} />}
    </Figure>
  );
};

export default GifVideo;
