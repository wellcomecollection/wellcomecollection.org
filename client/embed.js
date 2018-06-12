(function() {
  var wecoWorkEmbeds = document.querySelectorAll('.weco-work-embed');
  wecoWorkEmbeds.forEach(el => {
    if (!el.getAttribute('data-weco-enhanced')) {
      var workId = el.getAttribute('data-weco-work-id');
      var parentEl = el.parentElement;
      el.setAttribute('data-weco-enhanced', 'true');
      el.addEventListener('click', function() {
        const iframe = document.createElement('iframe');
        iframe.src = 'https://wellcomecollection/embed/work/' + workId;
        iframe.frameborder = '0';
        iframe.allowfullscreen = 'allowfullscreen';
        iframe.width = '100%';
        iframe.height = '100%';
        parentEl.insertBefore(iframe, el);
        parentEl.removeChild(el);
      });
    }
  });
})();
