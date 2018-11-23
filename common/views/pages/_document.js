// @flow
import Document, { Head, Main, NextScript } from 'next/document';
import getConfig from 'next/config';
import {parseOpeningHoursFromCollectionVenues} from '../../services/prismic/opening-times';
import Footer from '../components/Footer/Footer';
import NewsletterPromo from '../components/NewsletterPromo/NewsletterPromo';
import WellcomeCollectionJsonLd from '../components/WellcomeCollectionJsonLd/WellcomeCollectionJsonLd';

const {serverRuntimeConfig} = getConfig();
const prismicCollectionVenues = serverRuntimeConfig.getPrismicCollectionVenues();

export default function WecoDocument(css: string) {
  return class WecoDoc extends Document {
    static async getInitialProps(ctx: any) {
      const initialProps = await Document.getInitialProps(ctx);
      return { ...initialProps };
    }

    render() {
      // TODO: 👇 this, it wasn't working anyway
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
            <Main />
            <NewsletterPromo />
            <Footer
              openingHoursId='footer'
              groupedVenues={openingHours.groupedVenues}
              upcomingExceptionalOpeningPeriods={openingHours.upcomingExceptionalOpeningPeriods} />
            <NextScript />
          </body>
        </html>
      );
    }
  };
}
