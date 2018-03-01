// @ flow
import Head from 'next/head';
import HeadJs from '../Header/HeadJs';
import Header from '../Header/Header';
import {striptags} from '../../../utils/striptags';
import {formatDate} from '../../../utils/format-date';

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
  description,
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

// We will have two trackers, one that has been used on the v1 site, and v2 site (UA-55614-6)
// The other is just for the v2 site UA-55614-24
//
// The v1 site was setup with a lot of configuration, which feels like it would be out of sync with
// the new questions we would like ask of our analytics, so this was for a clean slate.
//
// `dimension5` is a test dimension. it's `dimension1` on v2
type AnalyticsCategory = 'collections' | 'editorial' | 'public-programme';
type AnalyticsProps = {|
  category: AnalyticsCategory,
  seriesUrl: ?string,
  positionInSeries: ?string,
  contentType: ?string,
  pageState: ?Object,
  featuresCohort: ?string,
|}
export const Analytics = ({
  category,
  seriesUrl,
  positionInSeries,
  contentType,
  pageState,
  featuresCohort
}: AnalyticsProps) => ([
  <style  key='analytics-1' dangerouslySetInnerHTML={{ __html: `.async-hide .header__nav{ opacity: 0 !important}` }} />,
  <script key='analytics-2' dangerouslySetInnerHTML={{ __html: `(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
    h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
    (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
  })(window,document.documentElement,'async-hide','dataLayer',4000,
    {'GTM-NXMJ6D9':true});`}} />,

  <script key='analytics-3' dangerouslySetInnerHTML={{ __html: `
    window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
    ga('create', 'UA-55614-24', 'auto', 'v2');

    ga('create', 'UA-55614-6', 'auto');
    ga('set', 'dimension1', '2');
    ga('set', 'appVersion', '2.1.0');

    ${category         ? `ga('set', 'dimension2', '${category}');` : ''}
    ${seriesUrl        ? `ga('set', 'dimension3', '${seriesUrl}');` : ''}
    ${positionInSeries ? `ga('set', 'dimension4', '${positionInSeries}');` : ''}
    ${contentType      ? `ga('set', 'dimension6', '${contentType}');` : ''}
    ${pageState        ? `ga('set', 'dimension8', '${JSON.stringify(pageState)}');` : ''}

    var referringComponentListString = localStorage.getItem('wc_referring_component_list');
    localStorage.removeItem('wc_referring_component_list');
    if (referringComponentListString) {
      ga('set', 'dimension5', referringComponentListString);
    }

    // see tracking.js where this storage item is set
    var referringComponentListString = localStorage.getItem('wc_referring_component_list');
    localStorage.removeItem('wc_referring_component_list');
    if (referringComponentListString) {
      ga('set', 'dimension7', referringComponentListString);
    }

    ${featuresCohort && featuresCohort !== 'default' ? `ga('set', 'dimension5', '${featuresCohort}');` : ''}

    ga('require', 'GTM-NXMJ6D9');
    ga('send', 'pageview');
    ga('v2.send', 'pageview');
  `}} />,
  <script key='analytics-4' async src='https://www.google-analytics.com/analytics.js' />
]);

type SiteSection = 'works' | 'explore' | 'whats-on';
type Props = {|
  children: React.Node,
  type: string,
  url: string,
  title: string,
  description: string,
  imageUrl: string,
  siteSection: SiteSection,
  analyticsCategory: string,
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
      {/* TODO: use flag as to whether to include this */}
      <Analytics
        category={analyticsCategory}
        seriesUrl={null}
        positionInSeries={null}
        contentType={null} />

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

      {/* CSS */}

      <link rel='preload' href='/static/css/non-critical.css' as='style' onLoad='this.rel="stylesheet"' />
      <link rel='apple-touch-icon' sizes='180x180' href='/static/icons/apple-touch-icon.png' />
      <link rel='shortcut icon' href='/static/icons/favicon.ico' type='image/ico' />
      <link rel='icon' type='image/png' href='/static/icons/favicon-32x32.png' sizes='32x32' />
      <link rel='icon' type='image/png' href='/static/icons/favicon-16x16.png' sizes='16x16' />
      <link rel='manifest' href='/static/icons/manifest.json' />
      <link rel='mask-icon' href='/static/icons/safari-pinned-tab.svg' color='#000000' />
      <script src='/static/libs/picturefill.min.js' async />
      {/* Leaving this out for now as it's hanging locally for me */}
      {/* <script src='//platform.twitter.com/widgets.js' async defer></script> */}
      <HeadJs enhancedJsPath='/static/js/app.js' />
      <script type='application/ld+json'>{/* JSON+LD Z */}</script>
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
    </div>
  </div>
);

export default DefaultPageLayout;
