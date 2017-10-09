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

function autoPlayGif(video) {
  if (inViewport(video)) {
    if (video.paused && shouldAutoPlay) {
      video.play();
    }
  } else {
    video.pause();
  }
};

export default function(el) {
  const video = el.querySelector('.js-gif-video__video');
  const playPause = el.querySelector('.js-gif-video__play-pause');

  video.muted = true;
  video.loop = true;

  // If the user stops the video, don't autoplay
  // unless they restart the video manually
  playPause.addEventListener('click', () => {
    if (video.paused) {
      video.play();
      shouldAutoPlay = true;
    } else {
      video.pause();
      shouldAutoPlay = false;
    }
  });

  onWindowScrollThrottle$.subscribe({
    next() {
      autoPlayGif(video);
    }
  });

  onWindowResizeDebounce$.subscribe({
    next() {
      autoPlayGif(video);
    }
  });

  autoPlayGif(video);
}

