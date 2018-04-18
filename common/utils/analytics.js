import ReactGA from 'react-ga';

type AnalyticsCategory = 'collections' | 'editorial' | 'public-programme';
type Props = {|
  category: AnalyticsCategory,
  contentType: ?string,
  pageState: ?Object,
  featuresCohort: ?string,
|}

export default ({ category, contentType, pageState, featuresCohort }: Props) => {
  const referringComponentListString = window.localStorage.getItem('wc_referring_component_list');
  window.localStorage.removeItem('wc_referring_component_list');

  if (!window.GA_INITIALIZED) {
    // We will have two trackers, one that has been used on the v1 site, and v2 site (UA-55614-6)
    // The other is just for the v2 site UA-55614-24

    // The v1 site was setup with a lot of configuration, which feels like it would be out of sync with
    // the new questions we would like ask of our analytics, so this was for a clean slate.
    ReactGA.initialize('UA-55614-6', {
      gaOptions: {
        cookieDomain: 'auto'
      }
    });
    ReactGA.initialize('UA-55614-24', {
      gaOptions: {
        cookieDomain: 'auto',
        name: 'v2'
      }
    });
    window.GA_INITIALIZED = true;
  }

  ReactGA.set({'appVersion': '2.1.0'});
  ReactGA.set({'dimension1': '2'});
  if (category) ReactGA.set({'dimension2': category});
  if (featuresCohort && featuresCohort !== 'default') ReactGA.set({'dimension5': featuresCohort});
  if (contentType) ReactGA.set({'dimension6': contentType});
  if (referringComponentListString) ReactGA.set({'dimension7': referringComponentListString});
  if (pageState) ReactGA.set({'dimension8': pageState});

  ReactGA.plugin.require('GTM-NXMJ6D9');
  ReactGA.pageview(`${window.location.pathname}${window.location.search}`);
};
