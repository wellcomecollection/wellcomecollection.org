// @ flow
import ReactGA from 'react-ga';
import {Component} from 'react';
import Head from 'next/head';
import NastyJs from '../Header/NastyJs';
import Header from '../Header/Header';
import {striptags} from '../../../utils/striptags';
import {formatDate, isDatePast} from '../../../utils/format-date';
import Footer from '../Footer/Footer';
import {placesOpeningHours} from '../../../model/opening-hours';
import {
  exceptionalDates,
  exceptionalOpeningPeriods,
  upcomingExceptionalOpeningPeriods
} from '../../../services/opening-times';

const futureExceptionalDates = exceptionalDates.filter(date => date && !isDatePast(date));
const exceptionalPeriods = exceptionalOpeningPeriods(futureExceptionalDates);

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
  title: 'Visit us',
  siteSection: 'visitus'
}, {
  href: 'https://wellcomecollection.org/whats-on',
  title: 'What\'s on',
  siteSection: 'whatson'
}, {
  href: '/explore',
  title: 'Stories',
  siteSection: 'explore'
}, {
  href: '/works',
  title: 'Images',
  siteSection: 'images'
}, {
  href: 'https://wellcomecollection.org/what-we-do',
  title: 'What we do',
  siteSection: 'whatwedo'
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
// export const Analytics = ({
//   category,
//   seriesUrl,
//   positionInSeries,
//   contentType,
//   pageState,
//   featuresCohort
// }: AnalyticsProps) => ([
//   <style  key='analytics-1' dangerouslySetInnerHTML={{ __html: `.async-hide .header__nav{ opacity: 0 !important}` }} />,
//   <script key='analytics-2' dangerouslySetInnerHTML={{ __html: `(function(a,s,y,n,c,h,i,d,e){s.className+=' '+y;h.start=1*new Date;
//     h.end=i=function(){s.className=s.className.replace(RegExp(' ?'+y),'')};
//     (a[n]=a[n]||[]).hide=h;setTimeout(function(){i();h.end=null},c);h.timeout=c;
//   })(window,document.documentElement,'async-hide','dataLayer',4000,
//     {'GTM-NXMJ6D9':true});`}} />,

//   <script key='analytics-3' dangerouslySetInnerHTML={{ __html: `
//     window.ga=window.ga||function(){(ga.q=ga.q||[]).push(arguments)};ga.l=+new Date;
//     ga('create', 'UA-55614-24', 'auto', 'v2');
//     ga('create', 'UA-55614-6', 'auto');
//     ga('send', 'pageview');
//     ga('v2.send', 'pageview');
//   `}} />,
//   <script key='analytics-4' async src='https://www.google-analytics.com/analytics.js' />
// ]);

type SiteSection = 'images' | 'explore' | 'whats-on';
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

class DefaultPageLayout extends Component<Props> {
  componentDidMount() {
    // TODO: move this into a util file
    const { analyticsCategory, featuresCohort }: AnalyticsProps = this.props;
    const referringComponentListString = window.localStorage.getItem('wc_referring_component_list');
    window.localStorage.removeItem('wc_referring_component_list');

    if (!window.GA_INITIALIZED) {
      ReactGA.initialize('UA-55614-24');
      window.GA_INITIALIZED = true;
    }

    ReactGA.set({'appVersion': '2.1.0'});
    ReactGA.set({'dimension1': '2'});
    if (analyticsCategory) ReactGA.set({'dimension2': analyticsCategory});
    // if (seriesUrl) ReactGA.set({'dimension3': seriesUrl});
    // if (positionInSeries) ReactGA.set({'dimension4': positionInSeries});
    if (featuresCohort && featuresCohort !== 'default') ReactGA.set({'dimension5': featuresCohort});
    // if (contentType) ReactGA.set({'dimension6': contentType});
    if (referringComponentListString) ReactGA.set({'dimension7': referringComponentListString});
    // if (pageState) ReactGA.set({'dimension8': pageState});

    ReactGA.plugin.require('GTM-NXMJ6D9');
    ReactGA.pageview(document.location.pathname);
  }

  render() {
    const { title, type, url, description, imageUrl, siteSection, children, featuresCohort, featureFlags, isPreview } = this.props;

    return (
      <div>
        <Head>
          <meta charSet='utf-8' />
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
          <Footer
            openingHoursId='footer'
            placesOpeningHours={placesOpeningHours}
            upcomingExceptionalOpeningPeriods={upcomingExceptionalOpeningPeriods(exceptionalPeriods)} />
        </div>
      </div>
    );
  }
}

class DPLWithLoader extends Component<Props> {
  componentDidMount = () => {
    const lazysizes = require('lazysizes');
    const FontFaceObserver = require('fontfaceobserver');

    const WB = new FontFaceObserver('Wellcome Bold Web', {weight: 'bold'});
    const HNL = new FontFaceObserver('Helvetica Neue Light Web');
    const HNM = new FontFaceObserver('Helvetica Neue Medium Web');
    const LR = new FontFaceObserver('Lettera Regular Web');

    Promise.all([WB.load(), HNL.load(), HNM.load(), LR.load()]).then(() => {
      document.documentElement.classList.add('fonts-loaded');
    }).catch(console.log);

    lazysizes.init();

    document.documentElement.classList.add('enhanced');
  }

  render() {
    return <DefaultPageLayout {...this.props} />;
  }
}

export default DPLWithLoader;
