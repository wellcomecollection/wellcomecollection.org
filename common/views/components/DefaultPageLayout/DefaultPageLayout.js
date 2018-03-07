// @ flow
import {Component} from 'react';
import Head from 'next/head';
import Header from '../Header/Header';
import {striptags} from '../../../utils/striptags';
import {formatDate} from '../../../utils/format-date';
import Footer from '../Footer/Footer';

// TODO: Hashed files
// TODO: Analytics
// TODO: Inline CSS
// TODO: JsonLd
// TODO: Feature flags / cohort
// TODO: Set the props

// Taken from: http://ogp.me/#no_vertical
type OgType = 'article' | 'website';
type OgData = {|
  type: OgType,
  url: string,
  title: string,
  description: string,
  imageUrl: string,
  imageAltText?: string,
  video?: string,
  publishTime?: Date,
  modifiedTime?: Date,
  section?: string, // e.g. technology
  tags?: string[]
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
}: OgData) => ([
  <meta key='og:site_name' property='og:site_name' content='Wellcome Collection' />,
  <meta key='og:type' property='og:type' content={type} />,
  <meta key='og:url' property='og:url' content={url} />,
  <meta key='og:title' property='og:title' content={title} />,
  <meta key='og:description' property='og:description' content={striptags(description)} />,
  // we add itemprop="image" as it's required for WhatsApp
  <meta key='og:image' property='og:image' content={imageUrl} itemProp='image' />,
  <meta key='og:image:width' property='og:image:width' content='1200' />,

  publishedTime && <meta key='og:article:published_time' property='og:article:published_time' content={formatDate(publishedTime)} />,
  modifiedTime && <meta key='og:article:modified_time' property='og:article:modified_time' content={formatDate(modifiedTime)} />,
  section && <meta key='og:article:section' property='og:article:section' content={section} />,
  videoUrl && <meta key='og:video' property='og:video' content={videoUrl} />
].concat((tags || []).map(tag =>
  <meta key={`og:tag:${tag}`} property='og:article:tag' content={tag} />
)).filter(_ => _));

export const TwitterCard = ({
  type,
  url,
  title,
  description = '',
  imageUrl,
  imageAltText
}: OgData) => ([
  <meta key='twitter:card' name='twitter:card' content='summary_large_image' />,
  <meta key='twitter:site' name='twitter:site' content='@ExploreWellcome' />,
  <meta key='twitter:url' name='twitter:url' content={url} />,
  <meta key='twitter:title' name='twitter:title' content={title} />,
  <meta key='twitter:description' name='twitter:description' content={striptags(description)} />,
  <meta key='twitter:image' name='twitter:image' content={imageUrl} />,
  imageAltText && <meta name='twitter:image:alt' content={imageAltText} />
].filter(_ => _));

const navLinks = [{
  href: 'https://wellcomecollection.org/visit',
  title: 'Visit us'
}, {
  href: 'https://wellcomecollection.org/whats-on',
  title: 'What\'s on',
  siteSection: 'whatson'
}, {
  href: '/explore',
  title: 'Explore',
  siteSection: 'explore'
}, {
  href: '/works',
  title: 'Images',
  siteSection: 'images'
}, {
  href: 'https://wellcomecollection.org/what-we-do',
  title: 'What we do'
}];

export const AnalyticsScripts = () => ([
  <style  key='analytics-1' dangerouslySetInnerHTML={{ __html: `.async-hide .header__nav{ opacity: 0 !important}` }} />,
  <script key='analytics-4' async src='https://www.google-analytics.com/analytics.js' />,
  <script key='analytics-5' async src='https://i.wellcomecollection.org/assets/libs/autotrack.js' />
]);

type AnalyticsCategory = 'collections' | 'editorial' | 'public-programme';
type SiteSection = 'images' | 'explore' | 'whats-on';
type Props = {|
  children: React.Node,
  type: string,
  url: string,
  title: string,
  description: string,
  imageUrl: string,
  siteSection: SiteSection,
  analyticsCategory: AnalyticsCategory,
  pageMeta?: React.Node,
  featuresCohort?: string,
  featureFlags?: string[],
  isPreview?: boolean
|}

const DefaultPageLayout = ({
  children,
  type,
  url,
  title,
  description,
  imageUrl,
  siteSection,
  analyticsCategory,
  featuresCohort = 'default',
  featureFlags = [],
  isPreview = false
}: Props) => (

  <div>
    <Head>
      <meta charSet='utf-8' />

      <AnalyticsScripts />
      <meta httpEquiv='X-UA-Compatible' content='IE=edge,chrome=1' />
      <title>{`${title} | Wellcome Collection`}</title>
      <meta name='viewport' content='width=device-width, initial-scale=1' />
      <meta name='theme-color' content='#000000'/>

      <OpenGraph
        type={type}
        url={url}
        title={title}
        description={description}
        imageUrl={imageUrl}
      />
      <TwitterCard
        type={type}
        url={url}
        title={title}
        description={description}
        imageUrl={imageUrl} />

      {/* TODO: CSS */}
      <link rel='preload' href='/static/css/non-critical.css' as='style' onLoad='this.onload=null;this.rel="stylesheet"' />
      <noscript><link rel='stylesheet' href='path/to/mystylesheet.css' /></noscript>
      <script dangerouslySetInnerHTML={{__html: `
        /*! loadCSS rel=preload polyfill. [c]2017 Filament Group, Inc. MIT License */
        !function(a){if(a.loadCSS){var b=loadCSS.relpreload={};if(b.support=function(){try{return a.document.createElement("link").relList.supports("preload")}catch(a){return!1}},b.poly=function(){for(var b=a.document.getElementsByTagName("link"),c=0;c<b.length;c++){var d=b[c];"preload"===d.rel&&"style"===d.getAttribute("as")&&(a.loadCSS(d.href,d,d.getAttribute("media")),d.rel=null)}},!b.support()){b.poly();var c=a.setInterval(b.poly,300);a.addEventListener&&a.addEventListener("load",function(){b.poly(),a.clearInterval(c)}),a.attachEvent&&a.attachEvent("onload",function(){a.clearInterval(c)})}}}(this);
      `}} />

      {/* We don't hash or locally reference these images, as they never seem to change */}
      <link rel='apple-touch-icon' sizes='180x180' href='https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png' />
      <link rel='shortcut icon' href='https://i.wellcomecollection.org/assets/icons/favicon.ico' type='image/ico' />
      <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-32x32.png' sizes='32x32' />
      <link rel='icon' type='image/png' href='https://i.wellcomecollection.org/assets/icons/favicon-16x16.png' sizes='16x16' />
      <link rel='manifest' href='https://i.wellcomecollection.org/assets/icons/manifest.json' />
      <link rel='mask-icon' href='https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg' color='#000000' />
      <script src='https://i.wellcomecollection.org/assets/libs/picturefill.min.js' async />
      {/* Leaving this out for now as it's hanging locally for me */}
      {/* <script src='//platform.twitter.com/widgets.js' async defer></script> */}

      <script type='application/ld+json'>{/* TODO: JSON+LD */}</script>
      <script dangerouslySetInnerHTML={{ __html: `
      window.WC = {
        featuresCohort: ${JSON.stringify(featuresCohort)},
        featureFlags: ${JSON.stringify(featureFlags)}
      }
    `}} />
      {url && <link rel='canonical' href={url} />}
    </Head>

    <div className={isPreview ? 'is-preview' : undefined}>
      <a className='skip-link' href='#main'>Skip to main content</a>
      <Header siteSection={siteSection} links={navLinks} />
      <div id='main' className='main' role='main'>
        {children}
      </div>
      <Footer openingHoursId='footer' />
    </div>
  </div>
);

class DPLWithOnLoad extends Component<Props> {
  componentDidMount = () => {
    const {analyticsCategory} = this.props;
    // TODO: figure out what to do with these when we get them
    const seriesUrl = null;
    const positionInSeries = null;
    const contentType = null;
    const pageState = null;
    const featuresCohort = null;

    /* eslint-disable */
    // Cutting the Mustard
    if ('visibilityState' in document) {
      const rootEl = document.documentElement;
      const FontFaceObserver = require('fontfaceobserver');
      const WB = new FontFaceObserver('Wellcome Bold Web', {weight: 'bold'});
      const HNL = new FontFaceObserver('Helvetica Neue Light Web');
      const HNM = new FontFaceObserver('Helvetica Neue Medium Web');
      const LR = new FontFaceObserver('Lettera Regular Web');
      Promise.all([WB.load(), HNL.load(), HNM.load(), LR.load()]).then(function() {
        rootEl.classList.add('fonts-loaded');
      }).catch((error) => console.log(error));
      rootEl.classList.add('enhanced');
      rootEl.classList.add('fonts-loaded');
    }

    // Google Optimize
    (function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
      h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
      (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
    })(window,document.documentElement,'async-hide','dataLayer',4000,
      {'GTM-NXMJ6D9':true});

    // Google analytics
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', 'UA-55614-24', 'auto', 'v2');

    ga('create', 'UA-55614-6', 'auto');
    ga('set', 'dimension1', '2');

    if (analyticsCategory) {
      ga('set', 'dimension2', analyticsCategory);
    }
    if (seriesUrl) {
      ga('set', 'dimension3', seriesUrl);
    }
    if (positionInSeries) {
      ga('set', 'dimension4', positionInSeries);
    }
    if (contentType) {
      ga('set', 'dimension6', contentType);
    }
    if (pageState) {
      ga('set', 'dimension8', JSON.stringify(pageState));
    }

    // see tracking.js where this storage item is set
    const referringComponentListString = localStorage.getItem('wc_referring_component_list');
    localStorage.removeItem('wc_referring_component_list');
    if (referringComponentListString) {
      ga('set', 'dimension7', referringComponentListString);
    }

    if(featuresCohort && featuresCohort !== 'default') {
      ga('set', 'dimension5', featuresCohort);
    }

    ga('require', 'urlChangeTracker', {
      fieldsObj: {
        dimension5: 'virtual-pageview'
      }
    });
    ga('require', 'GTM-NXMJ6D9');
    ga('send', 'pageview');
    ga('v2.send', 'pageview');
    /* eslint-enable */
  }

  render() {
    return <DefaultPageLayout {...this.props} />;
  }
}

export default DPLWithOnLoad;
