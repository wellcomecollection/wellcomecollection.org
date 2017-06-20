function init() {
  const hasInstagramEmbed = Boolean(document.querySelector('.instagram-media')) || Boolean(document.querySelector('[data-type="instapp:photo"]'));
  
  if (hasInstagramEmbed) {
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
