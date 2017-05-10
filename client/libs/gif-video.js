// Adapted from https://github.com/johnsonjo4531/videojs-gifplayer

// Copyright (c) John D. Johnson II &lt;johnsonjo4531@gmail.com&gt;

// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:

// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.

// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

import { onWindowScrollDebounce$, onWindowResizeDebounce$ } from '../js/utils/dom-events';
import { nodeList } from '../js/util';
import videojs from 'video.js';

const defaults = {
  controls: false,
  loop: true,
  restartOnPause: true,
  ignoreScroll: true
};

function inViewport(el) {
  let rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

function getScrollElement(node) {
  if (node === null) {
    return null;
  }

  if (node.scrollHeight > node.clientHeight) {
    return node;
  }

  return getScrollElement(node.parentNode);
}

function inScroll(el, player) {
  const elRect = el.getBoundingClientRect();
  const scrollEl = getScrollElement(el);

  if (scrollEl) {
    const scrollRect = scrollEl.getBoundingClientRect();

    return (
      scrollRect.top <= elRect.top &&
      scrollRect.left <= elRect.left &&
      scrollRect.bottom >= elRect.bottom &&
      scrollRect.right >= elRect.right
    );
  }

  return true;
}

function inUserView(el, { ignoreScroll }) {
  return ignoreScroll ? inViewport(el) : inViewport(el) && inScroll(el);
}

const autoPlayGifs = () => {
  const gifPlayers = nodeList(document.querySelectorAll('.vjs-gifplayer'));

  gifPlayers.forEach((gifPlayer) => {
    const player = gifPlayer.player;
    if (player) {
      if (inUserView(gifPlayer, player)) {
        if (player.paused()) {
          if (player.getAttribute('data-restartOnPause')) {
            player.currentTime(0);
          }
          player.play();
        }
      } else {
        player.pause();
      }
    }
  });
};

// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API
let hidden;
let visibilityChange;

if (typeof document.hidden !== 'undefined') {
  // Opera 12.10 and Firefox 18 and later support
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

// If the page is hidden, pause the video
// if the page is shown, play the video
function handleVisibilityChange() {
  if (document[hidden]) {
    const gifPlayers = nodeList(document.querySelectorAll('.vjs-gifplayer'));

    gifPlayers.forEach((gifPlayer) => {
      const player = gifPlayer.player;

      if (player) {
        player.pause();
      }
    });
  } else {
    autoPlayGifs();
  }
}

// Play every gif that is in the viewport, and
// pause every gif that is out of the viewport
onWindowScrollDebounce$.subscribe({
  next() {
    autoPlayGifs();
  }
});

onWindowResizeDebounce$.subscribe({
  next() {
    autoPlayGifs();
  }
});

document.addEventListener(visibilityChange, handleVisibilityChange, false);

const onPlayerReady = (player, options) => {
  player.addClass('vjs-gifplayer');
  player.loop(options.loop);
  player.controls(options.controls);
  player.ignoreScroll = options.ignoreScroll;

  if (options.restartOnPause) {
    player.setAttribute('data-restartOnPause', 'true');
  }

  autoPlayGifs();
};

const gifplayer = function(options) {
  this.ready(() => {
    onPlayerReady(this, videojs.mergeOptions(defaults, options));
  });
};

videojs.plugin('gifplayer', gifplayer);

export default gifplayer;
