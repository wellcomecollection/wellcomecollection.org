// @flow
import { Component, createRef } from 'react';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import { font, classNames } from '../../../utils/classnames';
import { trackEvent } from '../../../utils/ga';
import Tasl from '../Tasl/Tasl';
import Caption from '../Caption/Caption';
import type { HTMLString } from '../../../services/prismic/types';
import type { Tasl as TaslType } from '../../../model/tasl';
type Props = {|
  playbackRate: number,
  videoUrl: string,
  caption: ?HTMLString,
  tasl: ?TaslType,
|};

type State = {|
  canPlay: boolean,
  isPlaying: boolean,
  autoPlayDisabled: boolean,
  computedVideoWidth: ?number,
|};

class GifVideo extends Component<Props, State> {
  state = {
    canPlay: false,
    isPlaying: false,
    autoPlayDisabled: false,
    computedVideoWidth: null,
  };

  videoRef: { current: HTMLVideoElement | null } = createRef();

  inViewport = (video: HTMLElement) => {
    const rect = video.getBoundingClientRect();
    return (
      rect.top >= 0 - rect.height &&
      rect.top <= window.innerHeight &&
      rect.left >= 0 &&
      rect.left < window.innerWidth
    );
  };

  playVideo = (video: HTMLMediaElement) => {
    this.setState({
      isPlaying: true,
    });
    video.play();
  };

  pauseVideo = (video: HTMLMediaElement) => {
    this.setState({
      isPlaying: false,
    });
    video.pause();
  };

  autoControlGif = () => {
    const video = this.videoRef.current;

    const inViewAndPlayable =
      video && this.inViewport(video) && this.state.canPlay;
    if (video) {
      if (!this.state.autoPlayDisabled) {
        if (inViewAndPlayable) {
          this.playVideo(video);
        } else {
          this.pauseVideo(video);
        }
      }
    }
  };

  computeVideoWidth = () => {
    const computedVideoWidth =
      this.videoRef &&
      this.videoRef.current &&
      this.videoRef.current.clientWidth;

    this.setState({
      computedVideoWidth,
    });
  };

  manualControlGif = () => {
    const video = this.videoRef.current;
    if (video) {
      if (!this.state.isPlaying) {
        this.setState({
          autoPlayDisabled: false,
        });
        this.playVideo(video);
      } else {
        this.setState({
          autoPlayDisabled: true,
        });
        this.pauseVideo(video);
      }
    }
    trackEvent({
      category: 'GifVideo',
      action: this.state.isPlaying ? 'pause video' : 'play video',
      label: this.props.videoUrl,
    });
  };

  initVideoGif = (video: HTMLMediaElement) => {
    this.setState({
      canPlay: true,
    });

    setTimeout(() => {
      this.autoControlGif();
      this.computeVideoWidth();
    }, 0); // TODO - fix properly - canPlay is still false without setTimeout
  };

  debounceAutoControl = debounce(this.autoControlGif, 500);
  throttleAutoControl = throttle(this.autoControlGif, 100);
  debounceComputeVideoWidth = debounce(this.computeVideoWidth, 500);

  componentDidMount() {
    const video = this.videoRef.current;

    if (video) {
      video.playbackRate = this.props.playbackRate;

      if (video.readyState > 3) {
        this.initVideoGif(video);
      } else {
        video.addEventListener('loadedmetadata', () => {
          this.initVideoGif(video);
        });
      }
    }

    window.addEventListener('resize', this.debounceAutoControl);
    window.addEventListener('resize', this.debounceComputeVideoWidth);
    window.addEventListener('scroll', this.throttleAutoControl);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.debounceAutoControl);
    window.removeEventListener('resize', this.debounceComputeVideoWidth);
    window.removeEventListener('scroll', this.throttleAutoControl);
  }

  render() {
    const { videoUrl, caption, tasl } = this.props;
    const { canPlay, isPlaying, computedVideoWidth } = this.state;

    return (
      <figure className="gif-video no-margin text-align-center">
        <div className="gif-video__inner relative inline-block">
          <video
            ref={this.videoRef}
            className="gif-video__video block"
            preload="metadata"
            muted
            loop
            playsInline
          >
            <source src={videoUrl} type="video/mp4" />
            <p>{"Your browser doesn't support video"}</p>
          </video>
          {canPlay && (
            <button
              className={classNames({
                'no-margin no-padding plain-button gif-video__play-pause absolute': true,
              })}
              aria-label="play/pause button"
              onClick={this.manualControlGif}
            >
              <span
                className={classNames({
                  [font({ s: 'LR3' })]: true,
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
  }
}

export default GifVideo;
