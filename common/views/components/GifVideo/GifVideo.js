// @flow
import React, {Component} from 'react';
import {font, classNames} from '../../../utils/classnames';
import {trackGaEvent} from '../../../utils/tracking';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import Tasl from '../Tasl/Tasl';
import Caption from '../Caption/Caption';
type Props = {|
  playbackRate: number,
  videoUrl: string,
  caption: any, // TODO
  tasl: any // TODO
|}

type State = {|
  canPlay: boolean,
  isPlaying: boolean,
  autoPlayDisabled: boolean
|}

class GifVideo extends Component<Props, State> {
  state = {
    canPlay: false,
    isPlaying: false,
    autoPlayDisabled: false
  }

  videoRef = React.createRef();

  inViewport = (video: HTMLElement) => {
    const rect = video.getBoundingClientRect();
    return (
      rect.top >= 0 - rect.height &&
      rect.top <= window.innerHeight &&
      rect.left >= 0 &&
      rect.left < window.innerWidth
    );
  }

    playVideo = (video: HTMLMediaElement) => {
      this.setState({
        isPlaying: true
      });
      video.play();
    }

    pauseVideo = (video: HTMLMediaElement) => {
      this.setState({
        isPlaying: false
      });
      video.pause();
    }

    autoControlGif = () => {
      const video = this.videoRef.current;

      const inViewAndPlayable = video && this.inViewport(video) && this.state.canPlay;
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

    manualControlGif = () => {
      const video = this.videoRef.current;
      if (video) {
        if (!this.state.isPlaying) {
          this.setState({
            autoPlayDisabled: false
          });
          this.playVideo(video);
        } else {
          this.setState({
            autoPlayDisabled: true
          });
          this.pauseVideo(video);
        }
      }
      trackGaEvent({
        category: 'component',
        action: 'toggle-gif-video-play:click',
        label: `gif-video:${this.props.videoUrl}, click-action:${!this.state.isPlaying ? 'did-play' : 'did-pause'}`
      });
    };

    initVideoGif = (video: HTMLMediaElement) => {
      this.setState({
        canPlay: true
      });
      setTimeout(() => { this.autoControlGif(); }, 0); // TODO - fix properly - canPlay is still false without setTimeout
    };

    componentDidMount() {
      const video = this.videoRef.current;
      if (video) {
        video.playbackRate = this.props.playbackRate;
        if (video.readyState > 3) {
          this.initVideoGif(video);
        } else {
          video.addEventListener('canplaythrough', () => { this.initVideoGif(video); });
        }
      }
      window.addEventListener('resize', debounce(this.autoControlGif, 500));
      window.addEventListener('scroll', throttle(this.autoControlGif, 100));
    }

    // TODO remove 'data-track-label' and 'data-playback-rate' once we're completely moved over to using Nextjs
    render() {
      const { playbackRate, videoUrl, caption, tasl } = this.props;
      const { canPlay, isPlaying } = this.state;
      return (
        <figure className='js-gif-video gif-video no-margin' data-playback-rate={playbackRate}>
          <div className='gif-video__inner relative'>
            <video ref={this.videoRef} className='gif-video__video block js-gif-video__video'
              preload='metadata'
              muted
              loop
              playsInline>
              <source src={videoUrl} type='video/mp4' />
              <p>{'Your browser doesn\'t support video'}</p>
            </video>
            {canPlay && <button className={classNames({
              'no-margin no-padding plain-button gif-video__play-pause absolute js-gif-video__play-pause': true
            })}
            aria-label='play/pause button'
            data-track-label='{videoUrl}'
            onClick={this.manualControlGif}>
              <span className={classNames({
                [font({s: 'LR3'})]: true,
                'js-gif-video__text gif-video__text block': true,
                'gif-video__text--is-playing': isPlaying
              })}></span>
            </button>}
            {(tasl.title || tasl.sourceName || tasl.copyrightHolder || tasl.license) &&
            <Tasl {...tasl} />}
          </div>
          {caption && <Caption caption={caption} />}
        </figure>
      );
    }
}

export default GifVideo;
