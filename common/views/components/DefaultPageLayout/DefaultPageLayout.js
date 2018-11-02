// @flow
import {Component} from 'react';
import Head from 'next/head';
import NastyJs from '../Header/NastyJs';
import Header from '../Header/Header';
import NewsletterPromo from '../NewsletterPromo/NewsletterPromo';
import InfoBanner from '../InfoBanner/InfoBanner2';
import {striptags} from '../../../utils/striptags';
import {formatDate} from '../../../utils/format-date';
import {museumLd, objToJsonLd} from '../../../utils/json-ld';
import Footer from '../Footer/Footer';
import {wellcomeCollection} from '../../../model/organization';
import moment from 'moment';
import type {GroupedVenues, OverrideType, OpeningHours} from '../../../model/opening-hours';
import type {GlobalAlert} from '../../../model/global-alert';
import type Moment from 'moment';
import analytics from '../../../utils/analytics';
import Raven from 'raven-js';

export type JsonLdObject = {
  "@type": string
}
type jsonData = {
  data: JsonLdObject
};

const galleryOpeningTimes = function(galleryHours: ?OpeningHours) {
  if (galleryHours) {
    return {
      openingHoursSpecification: galleryHours && galleryHours.regular.map(
        openingHoursDay =>  {
          const specObject = objToJsonLd(openingHoursDay, 'OpeningHoursSpecification', false);
          delete specObject.note;
          return specObject;
        }
      ),
      specialOpeningHoursSpecification: galleryHours.exceptional && galleryHours.exceptional.map(
        openingHoursDate => {
          const specObject = {
            opens: openingHoursDate.opens,
            closes: openingHoursDate.closes,
            validFrom: moment(openingHoursDate.overrideDate).format('YYYY-MM-DD'),
            validThrough: moment(openingHoursDate.overrideDate).format('YYYY-MM-DD')
          };
          return objToJsonLd(specObject, 'OpeningHoursSpecification', false);
        }
      )
    };
  }
};

const JsonLd = ({
  data
}: jsonData) => {
  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}>
    </script>
  );
};

export type OgType = 'article' | 'website';
// Taken from: http://ogp.me/#no_vertical
type OgData = {|
  type: OgType,
  url: string,
  title: string,
  description: string,
  imageUrl: string,
  imageAltText?: string,
  video?: string,
  publishedTime?: Date,
  modifiedTime?: Date,
  section?: string, // e.g. technology
  tags?: string[],
  videoUrl?: string
|};
// TODO: Convert image sizes to og:1200, tw:800
export const OpenGraph = ({
  type,
  url,
  title,
  description = '',
  imageUrl,
  publishedTime,
  modifiedTime,
  videoUrl,
  section,
  tags
}: OgData): React.Element<'meta'>[] => ([
  <meta key='og:site_name' property='og:site_name' content='Wellcome Collection' />,
  <meta key='og:type' property='og:type' content={type} />,
  <meta key='og:url' property='og:url' content={url} />,
  <meta key='og:title' property='og:title' content={title} />,
  <meta key='og:description' property='og:description' content={striptags(description)} />,
  // we add itemprop="image" as it's required for WhatsApp
  imageUrl ? <meta key='og:image' property='og:image' content={imageUrl} itemProp='image' /> : null,
  imageUrl ? <meta key='og:image:width' property='og:image:width' content='1200' /> : null,

  publishedTime ? <meta key='og:article:published_time' property='og:article:published_time' content={formatDate(publishedTime)} /> : null,
  modifiedTime ? <meta key='og:article:modified_time' property='og:article:modified_time' content={formatDate(modifiedTime)} /> : null,
  section ? <meta key='og:article:section' property='og:article:section' content={section} /> : null,
  videoUrl ? <meta key='og:video' property='og:video' content={videoUrl} /> : null
].concat((tags || []).map(tag =>
  <meta key={`og:tag:${tag}`} property='og:article:tag' content={tag} />
)).filter(Boolean));

export const TwitterCard = ({
  type,
  url,
  title,
  description = '',
  imageUrl,
  imageAltText
}: OgData): React.Element<'meta'>[] => ([
  <meta key='twitter:card' name='twitter:card' content='summary_large_image' />,
  <meta key='twitter:site' name='twitter:site' content='@ExploreWellcome' />,
  <meta key='twitter:url' name='twitter:url' content={url} />,
  <meta key='twitter:title' name='twitter:title' content={title} />,
  <meta key='twitter:description' name='twitter:description' content={striptags(description)} />,
  <meta key='twitter:image' name='twitter:image' content={imageUrl} />,
  imageAltText ? <meta name='twitter:image:alt' content={imageAltText} /> : null
].filter(Boolean));

const navLinks = [{
  href: 'https://wellcomecollection.org/visit',
  title: 'Visit us',
  siteSection: 'visitus'
}, {
  href: 'https://wellcomecollection.org/whats-on',
  title: 'What\'s on',
  siteSection: 'whatson'
}, {
  href: '/stories',
  title: 'Stories',
  siteSection: 'stories'
}, {
  href: '/works',
  title: 'Images',
  siteSection: 'images'
}, {
  href: 'https://wellcomecollection.org/what-we-do',
  title: 'What we do',
  siteSection: 'whatwedo'
}];

export type SiteSection = 'images' | 'stories' | 'whats-on' | 'error';
type Props = {|
  children: React.Node,
  type: OgType,
  canonicalUrl: string,
  title: ?string,
  description: string,
  imageUrl: string,
  pageJsonLd: JsonLdObject,
  siteSection: SiteSection,
  analyticsCategory: string,
  featuresCohort?: string,
  featureFlags?: string[],
  isPreview?: boolean,
  openingTimes: {
    groupedVenues: GroupedVenues,
    upcomingExceptionalOpeningPeriods: ?{dates: Moment[], type: OverrideType}[]
  },
  globalAlert: GlobalAlert,
  oEmbedUrl?: string,
  pageState: Object
|}

class DefaultPageLayout extends Component<Props> {
  componentDidMount() {
    const { analyticsCategory, featuresCohort, pageState } = this.props;
    analytics({analyticsCategory, featuresCohort, pageState});

    // $FlowFixMe
    const lazysizes = require('lazysizes');
    // $FlowFixMe
    const FontFaceObserver = require('fontfaceobserver');

    const WB = new FontFaceObserver('Wellcome Bold Web', {weight: 'bold'});
    const HNL = new FontFaceObserver('Helvetica Neue Light Web');
    const HNM = new FontFaceObserver('Helvetica Neue Medium Web');
    const LR = new FontFaceObserver('Lettera Regular Web');

    Promise.all([WB.load(), HNL.load(), HNM.load(), LR.load()]).then(() => {
      // $FlowFixMe
      document.documentElement.classList.add('fonts-loaded');
    }).catch(console.log);

    lazysizes.init();

    // $FlowFixMe
    document.documentElement.classList.add('enhanced');

    Raven.config('https://f756b8d4b492473782987a054aa9a347@sentry.io/133634', {
      shouldSendCallback(data) {
        const oldSafari = /^.*Version\/[0-8].*Safari.*$/;
        const bingPreview = /^.*BingPreview.*$/;

        return ![oldSafari, bingPreview].some(r => r.test(window.navigator.userAgent));
      },
      whitelistUrls: [/wellcomecollection\.org/],
      ignoreErrors: [
        /Blocked a frame with origin/,
        /document\.getElementsByClassName\.ToString/ // https://github.com/SamsungInternet/support/issues/56
      ]
    }).install();

    // Prismic preview and validation warnings
    const isPreview = document.cookie.match('isPreview=true');
    if (isPreview) {
      window.prismic = {
        endpoint: 'https://wellcomecollection.prismic.io/api/v2'
      };
      const prismicScript = document.createElement('script');
      prismicScript.src = '//static.cdn.prismic.io/prismic.min.js';
      document.head && document.head.appendChild(prismicScript);
      (function () {
        var validationBar = document.createElement('div');
        validationBar.style.position = 'fixed';
        validationBar.style.width = '375px';
        validationBar.style.padding = '15px';
        validationBar.style.background = '#e01b2f';
        validationBar.style.color = '#ffffff';
        validationBar.style.bottom = '0';
        validationBar.style.right = '0';
        validationBar.style.fontSize = '12px';
        validationBar.style.zIndex = '2147483000';

        var validationFails = [];

        var descriptionEl = document.querySelector('meta[name="description"]');
        if (descriptionEl && !descriptionEl.getAttribute('content')) {
          validationFails.push(`
            <b>Warning:</b>
            This piece of content is missing its description.
            This helps with search engine results and sharing on social channels.
            (If this is from Prismic, it's the promo text).
          `);
        }

        var imageEl = document.querySelector('meta[property="og:image"]');
        if (imageEl && !imageEl.getAttribute('content')) {
          validationFails.push(`
            <b>Warning:</b>
            This piece of content is missing its promo image.
            This is the image that will be shown across our site,
            as well as on social media.
          `);
        }

        console.info(validationFails);

        if (validationFails.length > 0) {
          validationFails.forEach(function(validationFail) {
            var div = document.createElement('div');
            div.style.marginBottom = '6px';
            div.innerHTML = validationFail;
            validationBar.appendChild(div);
          });
          document.body && document.body.appendChild(validationBar);
        }
      })();
    }
  }

  componentDidCatch(error: Error, errorInfo: {componentStack: string}) {
    Raven.captureException(error, { extra: errorInfo });
  }

  componentDidUpdate() {
    const { analyticsCategory, featuresCohort, pageState } = this.props;
    analytics({analyticsCategory, featuresCohort, pageState});
  }

  render() {
    const {
      type,
      canonicalUrl,
      description,
      imageUrl,
      pageJsonLd,
      siteSection,
      children,
      featuresCohort,
      featureFlags,
      isPreview,
      openingTimes,
      globalAlert,
      oEmbedUrl
    } = this.props;

    const galleryVenue = openingTimes.groupedVenues.galleriesLibrary && openingTimes.groupedVenues.galleriesLibrary.hours.find(v => v.name === 'Galleries');
    const galleryVenueHours = galleryVenue && galleryVenue.openingHours;
    const title = this.props.title
      ? `${this.props.title} | Wellcome Collection`
      : 'Wellcome Collection | The free museum and library for the incurably curious';

    const polyfillFeatures = [
      'default',
      'Array.prototype.find',
      'Array.prototype.includes',
      'WeakMap'
    ];
    return (
      <div>
        <Head>
          <meta charSet='utf-8' />
          <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
          <title>{title}</title>
          <script src={`https://cdn.polyfill.io/v2/polyfill.js?features=${polyfillFeatures.join(',')}`}></script>
          <meta name='viewport' content='width=device-width, initial-scale=1' />
          <meta name='theme-color' content='#000000' />
          <meta name='description' content={description || ''} />
          <meta property='og:image' content={imageUrl || ''} />

          <OpenGraph
            type={type}
            url={canonicalUrl}
            title={title}
            description={description}
            imageUrl={imageUrl}
          />
          <TwitterCard
            type={type}
            url={canonicalUrl}
            title={title}
            description={description}
            imageUrl={imageUrl} />

          <link rel='apple-touch-icon' sizes='180x180' href='https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png' />
          <link rel='shortcut icon' href='https://i.wellcomecollection.org/assets/icons/favicon.ico' type='image/ico' />
          <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-32x32.png' sizes='32x32' />
          <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-16x16.png' sizes='16x16' />
          <link rel='manifest' href='https://i.wellcomecollection.org/assets/icons/manifest.json' />
          <link rel='mask-icon' href='https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg' color='#000000' />
          <script src='https://i.wellcomecollection.org/assets/libs/picturefill.min.js' async />
          {/* Leaving this out for now as it's hanging locally for me */}
          {/* <script src='//platform.twitter.com/widgets.js' async defer></script> */}
          <NastyJs />
          <JsonLd data={pageJsonLd} />
          <JsonLd data={museumLd(Object.assign({}, wellcomeCollection, galleryOpeningTimes(galleryVenueHours)))} />
          <script dangerouslySetInnerHTML={{ __html: `
            window.WC = {
              featuresCohort: ${JSON.stringify(featuresCohort)},
              featureFlags: ${JSON.stringify(featureFlags)}
            }
          `}} />
          {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
          {oEmbedUrl && <link
            rel='alternate'
            type='application/json+oembed'
            href={oEmbedUrl}
            title={title} />}
        </Head>

        <div className={isPreview ? 'is-preview' : undefined}>
          <a className='skip-link' href='#main'>Skip to main content</a>
          <Header siteSection={siteSection} links={navLinks} />
          {globalAlert.isShown &&
            <InfoBanner text={globalAlert.text} cookieName='WC_globalAlert' />
          }
          <div id='main' className='main' role='main'>
            {children}
          </div>
          <NewsletterPromo />
          {openingTimes &&
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
          }
        </div>
      </div>
    );
  }
}

export default DefaultPageLayout;
