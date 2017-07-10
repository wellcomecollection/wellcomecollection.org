export default function(el) {
  const previousUrl = document.referrer;
  const searchPathRegex = /\/search\?/;
  const isFromResultsPage = searchPathRegex.test(previousUrl);

  if (!isFromResultsPage) return;

  el.querySelector('a').setAttribute('href', previousUrl);
  el.classList.remove('is-hidden');
}
