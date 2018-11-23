// @flow
import Document, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';
import {parseOpeningHoursFromCollectionVenues} from '../../services/prismic/opening-times';
import Footer from '../components/Footer/Footer';
import InfoBanner from '../components/InfoBanner/InfoBanner';
import NewsletterPromo from '../components/NewsletterPromo/NewsletterPromo';
import Header from '../components/Header/Header';
import WellcomeCollectionJsonLd from '../components/WellcomeCollectionJsonLd/WellcomeCollectionJsonLd';

const {serverRuntimeConfig} = getConfig();
const prismicGlobalAlert = serverRuntimeConfig.getPrismicGlobalAlert();
const prismicCollectionVenues = serverRuntimeConfig.getPrismicCollectionVenues();

type SiteSection = string;
function getSiteSection(pathname: string): SiteSection {
  if (pathname.match(/^\/works/)) {
    return 'works';
  } else if (pathname.match(/^\/[stories|articles|series]/)) {
    return 'stories';
  } else if (pathname.match(/^\/[exhibitions|events|installations|whats\-on|event\-series]/)) {
    return 'whatson';
  } else {
    // TODO: we need to descern between what-we-do and visit-us
    return 'visit-us';
  }
}

export default function WecoDocument(css: string) {
  return class WecoDoc extends Document {
    static async getInitialProps(ctx: any) {
      const initialProps = await Document.getInitialProps(ctx);
      const siteSection = getSiteSection(ctx.pathname);
      return { ...initialProps, siteSection };
    }

    render() {
      const {siteSection} = this.props;
      // TODO: 👇 this, it wasn't working anyway
      const isPreview = false;

      // I don't really like this here, but it's the best of a bad bunch
      const openingHours = parseOpeningHoursFromCollectionVenues(prismicCollectionVenues);
      return (
        <html id='top' lang='en'>
          <Head>
            <meta charSet='utf-8' />
            <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
            <meta name='viewport' content='width=device-width, initial-scale=1' />
            <meta name='theme-color' content='#000000' />
            <link rel='apple-touch-icon' sizes='180x180' href='https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png' />
            <link rel='shortcut icon' href='https://i.wellcomecollection.org/assets/icons/favicon.ico' type='image/ico' />
            <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-32x32.png' sizes='32x32' />
            <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-16x16.png' sizes='16x16' />
            <link rel='manifest' href='https://i.wellcomecollection.org/assets/icons/manifest.json' />
            <link rel='mask-icon' href='https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg' color='#000000' />
            <script src='https://i.wellcomecollection.org/assets/libs/picturefill.min.js' async />
            <style dangerouslySetInnerHTML={{ __html: css }} />
            <WellcomeCollectionJsonLd
              prismicCollectionVenues={prismicCollectionVenues} />
          </Head>
          <body>
            <div className={isPreview ? 'is-preview' : undefined}>
              <a className='skip-link' href='#main'>Skip to main content</a>
              <Header siteSection={siteSection} />
              {prismicGlobalAlert.isShown === 'show' &&
                <InfoBanner
                  text={prismicGlobalAlert.text}
                  cookieName='WC_globalAlert' />
              }
              <div id='main' className='main' role='main'>
                <Main />
              </div>
              <NewsletterPromo />
              <Footer
                openingHoursId='footer'
                groupedVenues={openingHours.groupedVenues}
                upcomingExceptionalOpeningPeriods={openingHours.upcomingExceptionalOpeningPeriods} />
            </div>
            <NextScript />
          </body>
        </html>
      );
    }
  };
}
