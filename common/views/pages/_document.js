// @flow
import Document, { Head, Main, NextScript } from 'next/document';
import Footer from '../components/Footer/Footer';
import InfoBanner from '../components/InfoBanner/InfoBanner';
import NewsletterPromo from '../components/NewsletterPromo/NewsletterPromo';
import Header from '../components/Header/Header';
import getConfig from 'next/config';

const {serverRuntimeConfig} = getConfig();
const prismicGlobalAlert = serverRuntimeConfig.getPrismicGlobalAlert();

const siteSections = {
  'works': 'works'
};

// const galleryOpeningTimes = function(galleryHours: ?OpeningHours) {
//   if (galleryHours) {
//     return {
//       openingHoursSpecification: galleryHours && galleryHours.regular.map(
//         openingHoursDay =>  {
//           const specObject = objToJsonLd(openingHoursDay, 'OpeningHoursSpecification', false);
//           delete specObject.note;
//           return specObject;
//         }
//       ),
//       specialOpeningHoursSpecification: galleryHours.exceptional && galleryHours.exceptional.map(
//         openingHoursDate => {
//           const specObject = {
//             opens: openingHoursDate.opens,
//             closes: openingHoursDate.closes,
//             validFrom: moment(openingHoursDate.overrideDate).format('YYYY-MM-DD'),
//             validThrough: moment(openingHoursDate.overrideDate).format('YYYY-MM-DD')
//           };
//           return objToJsonLd(specObject, 'OpeningHoursSpecification', false);
//         }
//       )
//     };
//   }
// };

export default function WecoDocument(css: string) {
  return class WecoDoc extends Document {
    static async getInitialProps(ctx: any) {
      console.info(ctx.pathname);
      const initialProps = await Document.getInitialProps(ctx);
      return { ...initialProps };
    }

    render() {
      // TODO: 👇 this, it wasn't working anyway
      const isPreview = false;
      const openingTimes = null;
      // const galleryVenue =
      //   openingTimes.groupedVenues.galleriesLibrary &&
      //   openingTimes.groupedVenues.galleriesLibrary.hours.find(v => v.name === 'Galleries');
      // const galleryVenueHours = galleryVenue && galleryVenue.openingHours;
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

            {/* <JsonLd data={museumLd(Object.assign({}, wellcomeCollection, galleryOpeningTimes(galleryVenueHours)))} /> */}
          </Head>
          <body>
            <div className={isPreview ? 'is-preview' : undefined}>
              <a className='skip-link' href='#main'>Skip to main content</a>
              <Header siteSection={'works'} />
              {prismicGlobalAlert.isShown === 'show' &&
                <InfoBanner
                  text={prismicGlobalAlert.text}
                  cookieName='WC_globalAlert' />
              }
              <div id='main' className='main' role='main'>
                <Main />
              </div>
              <NewsletterPromo />
              {/* openingTimes &&
                <Footer
                  openingHoursId='footer'
                  groupedVenues={openingTimes.groupedVenues}
                  upcomingExceptionalOpeningPeriods={openingTimes.upcomingExceptionalOpeningPeriods} />
              */}
              {/*! openingTimes &&
                <Footer
                  groupedVenues={{}}
                  upcomingExceptionalOpeningPeriods={[]}
                  openingHoursId='footer' />
              */}
            </div>
            <NextScript />
          </body>
        </html>
      );
    }
  };
}
