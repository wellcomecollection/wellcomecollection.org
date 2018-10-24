import ReactGA from 'react-ga';
import Router from 'next/router';
import throttle from 'lodash.throttle';

type AnalyticsCategory = 'collections' | 'editorial' | 'public-programme';
type Props = {|
  category: AnalyticsCategory,
  contentType: ?string,
  pageState: ?Object,
  featuresCohort: ?string
|}

function testLocalStorage() { // Test localStorage i/o
  const test = 'test';

  try {
    window.localStorage.setItem(test, test);
    window.localStorage.removeItem(test);

    return true;
  } catch (e) {
    return false;
  }
};

const hasWorkingLocalStorage = testLocalStorage();

export default ({
  category,
  contentType,
  pageState,
  featuresCohort
}: Props) => {
  const referringComponentListString = hasWorkingLocalStorage && window.localStorage.getItem('wc_referring_component_list');
  window.localStorage.removeItem('wc_referring_component_list');

  if (!window.GA_INITIALIZED) {
    // We will have two trackers, one that has been used on the v1 site, and v2 site (UA-55614-6)
    // The other is just for the v2 site UA-55614-24

    // The v1 site was setup with a lot of configuration, which feels like it would be out of sync with
    // the new questions we would like ask of our analytics, so this was for a clean slate.
    ReactGA.initialize([{
      trackingId: 'UA-55614-6',
      titleCase: false
    }, {
      trackingId: 'UA-55614-24',
      titleCase: false,
      gaOptions: {
        name: 'v2'
      }
    }]);

    window.GA_INITIALIZED = true;
  }

  ReactGA.set({'dimension1': '2'});
  if (category) {
    ReactGA.set({'dimension2': category});
  };
  if (featuresCohort && featuresCohort !== 'default') {
    ReactGA.set({'dimension5': featuresCohort});
  }
  if (contentType) {
    ReactGA.set({'dimension6': contentType});
  }
  if (referringComponentListString) {
    ReactGA.set({'dimension7': referringComponentListString});
  }
  if (pageState) {
    ReactGA.set({'dimension8': pageState});
  };

  ReactGA.plugin.require('GTM-NXMJ6D9');
  const pageview = `${window.location.pathname}${window.location.search}`;
  ReactGA.pageview(pageview, ['v2']);

  Router.onRouteChangeStart = url => {
    window.performance.mark('onRouteChangeStart');
  };

  Router.onRouteChangeComplete = url => {
    window.performance.mark('onRouteChangeEnd');
    window.performance.measure(
      'onRouteChange',
      'onRouteChangeStart',
      'onRouteChangeEnd'
    );
    const measure = window.performance.getEntriesByName('onRouteChange')[0];
    ReactGA.timing({
      category: 'Navigation',
      variable: 'routeChange',
      value: Math.round(measure.duration),
      label: url
    });

    window.performance.clearMarks();
    window.performance.clearMeasures();
  };

  // Setup scroll tracking
  const startTime = new Date().getTime();
  const scrollCache = [];
  window.addEventListener('scroll', throttle(() => {
    const el = document.getElementById('main');
    if (el) {
      const timing = new Date().getTime() - startTime;
      const elHeight = el.offsetHeight + el.offsetTop;
      const winHeight = window.innerHeight;
      const scrollDistance = window.pageYOffset + winHeight;
      const marks = {
        '25%': parseInt(elHeight * 0.25, 10),
        '50%': parseInt(elHeight * 0.5, 10),
        '75%': parseInt(elHeight * 0.75, 10),
        '100%': elHeight
      };
      Object.keys(marks).forEach((mark) => {
        const val = marks[mark];

        if (scrollCache.indexOf(mark) === -1 && scrollDistance >= val) {
          scrollCache.push(mark);

          ReactGA.event({
            category: 'Scroll Depth',
            action: 'Percentage',
            label: mark,
            value: 1,
            nonInteraction: true
          });

          ReactGA.timing({
            category: 'Scroll Timing',
            action: 'Scroll Timing',
            variable: `Scrolled ${mark}`,
            value: timing
          });
        }
      });
    }
  }, 100));
};
