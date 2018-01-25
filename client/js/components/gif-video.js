import { onWindowScrollThrottle$, onWindowResizeDebounce$ } from '../utils/dom-events';
import { trackGaEvent } from '../tracking';

function inViewport(el) {
  const rect = el.getBoundingClientRect();
  // If *any* part of the video is in the viewport
  return (
    rect.top >= 0 - rect.height &&
    rect.top <= window.innerHeight &&
    rect.left >= 0 &&
    rect.left < window.innerWidth
  );
}

function autoPlayGif(video, textEl) {
  if (inViewport(video)) {
    if (video.paused && !video.classList.contains('is-autoplay-disabled')) {
      video.play();
      textEl.classList.add('gif-video__text--is-playing');
    }
  } else {
    video.pause();
    textEl.classList.remove('gif-video__text--is-playing');
  }
};

export default function(el) {
  const video = el.querySelector('.js-gif-video__video');
  const playPause = el.querySelector('.js-gif-video__play-pause');
  const textEl = playPause.querySelector('.js-gif-video__text');
  const trackingLabel = playPause.getAttribute('data-track-label');
  const playbackRate = Number(el.getAttribute('data-playback-rate'));

  video.playbackRate = playbackRate;

  // Hide the play/pause button until the video can loop
  video.addEventListener('canplaythrough', () => {
    playPause.classList.remove('is-hidden');
  });

  // If the user stops the video, don't autoplay
  // unless they restart the video manually
  playPause.addEventListener('click', () => {
    trackGaEvent({
      category: 'component',
      action: 'toggle-gif-video-play:click',
      label: `gif-video:${trackingLabel}, click-action:${video.paused ? 'did-play' : 'did-pause'}`
    });

    if (video.paused) {
      video.play();
      video.classList.remove('is-autoplay-disabled');
      textEl.classList.add('gif-video__text--is-playing');
    } else {
      video.pause();
      video.classList.add('is-autoplay-disabled');
      textEl.classList.remove('gif-video__text--is-playing');
    }
  });

  onWindowScrollThrottle$.subscribe({
    next() {
      autoPlayGif(video, textEl);
    }
  });

  onWindowResizeDebounce$.subscribe({
    next() {
      autoPlayGif(video, textEl);
    }
  });

  autoPlayGif(video, textEl);
}

