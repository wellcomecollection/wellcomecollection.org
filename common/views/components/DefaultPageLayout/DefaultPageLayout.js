// @flow
import type {GroupedVenues, OverrideType} from '../../../model/opening-hours';
import type {GlobalAlert} from '../../../model/global-alert';
import {Component} from 'react';
import Head from 'next/head';
import type Moment from 'moment';
import {striptags} from '../../../utils/striptags';
import {formatDate} from '../../../utils/format-date';
import analytics from '../../../utils/analytics';
import Raven from 'raven-js';
import Header from  '../Header/Header';
import InfoBanner from  '../InfoBanner/InfoBanner';

export type JsonLdObject = {
  "@type": string
}
type jsonData = {
  data: JsonLdObject
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

export type SiteSection =
  | 'works'
  | 'stories'
  | 'whats-on'
  | 'error'
  | 'visit-us'
  | 'what-we-do';
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

    // Hotjar
    (function(h, o, t, j, a, r) {
      h.hj = h.hj || function() { (h.hj.q = h.hj.q || []).push(arguments); };
      h._hjSettings = {hjid: 3858, hjsv: 5};
      a = o.getElementsByTagName('head')[0];
      r = o.createElement('script'); r.async = true;
      r.src = t + h._hjSettings.hjid + j + h._hjSettings.hjsv;
      a.appendChild(r);
    })(window, document, '//static.hotjar.com/c/hotjar-', '.js?sv=');

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
      globalAlert,
      children,
      oEmbedUrl
    } = this.props;

    const title = this.props.title
      ? `${this.props.title} | Wellcome Collection`
      : 'Wellcome Collection | The free museum and library for the incurably curious';

    const polyfillFeatures = [
      'default',
      'Array.prototype.find',
      'Array.prototype.includes',
      'WeakMap'
    ];
    const isPreview = false;
    console.info(globalAlert);
    return (
      <div>
        <Head>
          <title>{title}</title>
          <script src={`https://cdn.polyfill.io/v2/polyfill.js?features=${polyfillFeatures.join(',')}`}></script>
          <meta name='description' content={description || ''} />
          <meta property='og:image' content={imageUrl || ''} />
          {canonicalUrl && <link rel='canonical' href={canonicalUrl} />}
          {oEmbedUrl && <link
            rel='alternate'
            type='application/json+oembed'
            href={oEmbedUrl}
            title={title} />}

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

          <JsonLd data={pageJsonLd} />
        </Head>
        <div className={isPreview ? 'is-preview' : undefined}>
          <a className='skip-link' href='#main'>Skip to main content</a>
          <Header siteSection={siteSection} />
          {globalAlert.isShown &&
            <InfoBanner
              text={globalAlert.text}
              cookieName='WC_globalAlert' />
          }
          <div id='main' className='main' role='main'>
            {children}
          </div>
        </div>
      </div>
    );
  }
}

export default DefaultPageLayout;
