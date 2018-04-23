import ReactGA from 'react-ga';

export default (url: string) => {
  const isExternal = new window.URL(url).host !== window.location.host;

  if (isExternal) {
    ReactGA.event({
      category: 'outbound',
      action: 'click',
      label: url,
      transport: 'beacon'
    });
  }
};
