import { onWindowScrollThrottle$, onWindowResizeDebounce$ } from '../utils/dom-events';

let shouldAutoPlay = true;

function inViewport(el) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function autoPlayGif(video, textEl) {
  if (inViewport(video)) {
    if (video.paused && shouldAutoPlay) {
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

  video.muted = true;
  video.loop = true;

  // If the user stops the video, don't autoplay
  // unless they restart the video manually
  playPause.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      textEl.classList.add('gif-video__text--is-playing');
      shouldAutoPlay = true;
    } else {
      video.pause();
      textEl.classList.remove('gif-video__text--is-playing');
      shouldAutoPlay = false;
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

