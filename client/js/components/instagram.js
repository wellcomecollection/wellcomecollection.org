const instagramPost = document.querySelector('.instagram-media');

function init() {
  if (instagramPost) {
    const s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.defer = true;
    s.src = '//platform.instagram.com/en_US/embeds.js';

    const x = document.getElementsByTagName('script')[0];
    x.parentNode.insertBefore(s, x);
  }
}

export default {
  init
};
