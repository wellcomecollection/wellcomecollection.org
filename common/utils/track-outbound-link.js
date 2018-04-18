import ReactGA from 'react-ga';

function getDomain(url: string): string {
  return url.replace('http://', '').replace('https://', '').split('/')[0];
}

function isExternal(url: string): boolean {
  return getDomain(document.location.href) !== getDomain(url);
}

export default (url: string) => {
  if (isExternal(url)) {
    ReactGA.event({
      category: 'outbound',
      action: 'click',
      label: url,
      transport: 'beacon'
    });
  }
};
