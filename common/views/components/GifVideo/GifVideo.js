// @flow
import React, {Component} from 'react';
import {font, classNames} from '../../../utils/classnames';
import {trackGaEvent} from '../../../utils/tracking';
import debounce from 'lodash.debounce';
import throttle from 'lodash.throttle';
import Tasl from '../Tasl/Tasl';
import Caption from '../Caption/Caption';
import type {HTMLString} from '../../../services/prismic/types';
import type {Tasl as TaslType} from '../../../model/tasl';
type Props = {|
  playbackRate: number,
  videoUrl: string,
  caption: ?HTMLString,
  tasl: ?TaslType
|}

type State = {|
  canPlay: boolean,
  isPlaying: boolean,
  autoPlayDisabled: boolean,
  computedVideoWidth: ?number
|}

class GifVideo extends Component<Props, State> {
  state = {
    canPlay: false,
    isPlaying: false,
    autoPlayDisabled: false,
    computedVideoWidth: null
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

    setVideoSize = () => {
      this.setState({
        computedVideoWidth: this.videoRef && this.videoRef.current && this.videoRef.current.clientWidth
      });
    }

    debounceAutoControl = debounce(this.autoControlGif, 500);
    throttleAutoControl = throttle(this.autoControlGif, 100);
    debouncedSetVidoSize = debounce(this.setVideoSize, 500);

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
      this.setVideoSize();
      window.addEventListener('resize', this.debounceAutoControl);
      window.addEventListener('scroll', this.throttleAutoControl);
      window.addEventListener('resize', this.debouncedSetVidoSize);
    }

    componentWillUnmount() {
      window.removeEventListener('resize', this.debounceAutoControl);
      window.removeEventListener('scroll', this.throttleAutoControl);
      window.removeEventListener('resize', this.debouncedSetVidoSize);
    }

    render() {
      const { videoUrl, caption, tasl } = this.props;
      const { canPlay, isPlaying, computedVideoWidth } = this.state;
      return (
        <figure style={{
          marginLeft: '50%',
          transform: computedVideoWidth && `translateX(${computedVideoWidth / -2}px)`
        }}
        className='gif-video no-margin'>
          <div className='gif-video__inner relative inline-block'>
            <video ref={this.videoRef} className='gif-video__video block'
              preload='metadata'
              muted
              loop
              playsInline>
              <source src={videoUrl} type='video/mp4' />
              <p>{'Your browser doesn\'t support video'}</p>
            </video>
            {canPlay && <button className={classNames({
              'no-margin no-padding plain-button gif-video__play-pause absolute': true
            })}
            aria-label='play/pause button'
            onClick={this.manualControlGif}>
              <span className={classNames({
                [font({s: 'LR3'})]: true,
                'gif-video__text block': true,
                'gif-video__text--is-playing': isPlaying
              })}></span>
            </button>}
            {(tasl && (tasl.title || tasl.sourceName || tasl.copyrightHolder || tasl.license)) &&
            <Tasl {...tasl} />}
          </div>
          {caption && <Caption width={computedVideoWidth} caption={caption} />}
        </figure>
      );
    }
}

export default GifVideo;
