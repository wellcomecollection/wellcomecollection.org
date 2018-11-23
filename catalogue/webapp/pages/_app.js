// @flow
import App, { Container } from 'next/app';
import Head from 'next/head';
import Header from '@weco/common/views/components/Header/Header';
import InfoBanner from '@weco/common/views/components/InfoBanner/InfoBanner';
import NewsletterPromo from '@weco/common/views/components/NewsletterPromo/NewsletterPromo';
import Footer from '@weco/common/views/components/Footer/Footer';

const isServer = typeof window === 'undefined';
const isClient = !isServer;

let toggles;
let openingHours;
let globalAlert;

export default class MyApp extends App {
  static async getInitialProps({ Component, router, ctx }) {
    toggles = isServer ? router.query.toggles : toggles;
    openingHours = isServer ? router.query.openingHours : openingHours;
    globalAlert = isServer ? router.query.globalAlert : globalAlert;

    let pageProps = {};
    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx);
    }

    return {
      pageProps,
      toggles,
      openingHours,
      globalAlert
    };
  }

  constructor(props) {
    if (isClient && !toggles) { toggles = props.toggles; }
    if (isClient && !openingHours) { openingHours = props.openingHours; }
    if (isClient && !globalAlert) { globalAlert = props.globalAlert; }
    super(props);
  }

  render () {
    const {
      Component,
      pageProps,
      toggles,
      openingHours,
      globalAlert
    } = this.props;
    const polyfillFeatures = [
      'default',
      'Array.prototype.find',
      'Array.prototype.includes',
      'WeakMap'
    ];
    const isPreview = false;

    return (
      <Container>
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
          <script src={`https://cdn.polyfill.io/v2/polyfill.js?features=${polyfillFeatures.join(',')}`}></script>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <link rel='apple-touch-icon' sizes='180x180' href='https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png' />
          <link rel='shortcut icon' href='https://i.wellcomecollection.org/assets/icons/favicon.ico' type='image/ico' />
          <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-32x32.png' sizes='32x32' />
          <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-16x16.png' sizes='16x16' />
          <link rel='manifest' href='https://i.wellcomecollection.org/assets/icons/manifest.json' />
          <link rel='mask-icon' href='https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg' color='#000000' />
          <script src='https://i.wellcomecollection.org/assets/libs/picturefill.min.js' async />
        </Head>
        <div className={isPreview ? 'is-preview' : undefined}>
          <a className='skip-link' href='#main'>Skip to main content</a>
          <Header siteSection={'works'} />
          {globalAlert.isShown === 'show' &&
            <InfoBanner text={globalAlert.text} cookieName='WC_globalAlert' />
          }
          <div id='main' className='main' role='main'>
            <Component {...pageProps} />
          </div>
          <NewsletterPromo />
          {/* openingTimes &&
            <Footer
              openingHoursId='footer'
              groupedVenues={openingTimes.groupedVenues}
              upcomingExceptionalOpeningPeriods={openingTimes.upcomingExceptionalOpeningPeriods} />
          }
          {!openingTimes &&
            <Footer
              groupedVenues={{}}
              upcomingExceptionalOpeningPeriods={[]}
              openingHoursId='footer' />
          */}
        </div>
      </Container>
    );
  }
}
