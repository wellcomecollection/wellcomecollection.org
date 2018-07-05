// @flow
import {Component} from 'react';
import Head from 'next/head';
import NastyJs from '../Header/NastyJs';
import Header from '../Header/Header';
import {striptags} from '../../../utils/striptags';
import {formatDate} from '../../../utils/format-date';
import Footer from '../Footer/Footer';
import type {PlacesOpeningHours} from '../../../model/opening-hours';
import analytics from '../../../utils/analytics';

// TODO: Hashed files
// TODO: Inline CSS
// TODO: JsonLd
// TODO: Feature flags / cohort
// TODO: Set the props

// Taken from: http://ogp.me/#no_vertical
export type OgType = 'article' | 'website';
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
  <meta key='og:image' property='og:image' content={imageUrl} itemProp='image' />,
  <meta key='og:image:width' property='og:image:width' content='1200' />,

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

export type SiteSection = 'images' | 'explore' | 'whats-on';
type Props = {|
  children: React.Node,
  type: OgType,
  canonicalUrl: string,
  title: string,
  description: string,
  imageUrl: string,
  siteSection: SiteSection,
  analyticsCategory: string,
  featuresCohort?: string,
  featureFlags?: string[],
  isPreview?: boolean,
  openingTimes: {
    groupedVenues: {
      [string]: PlacesOpeningHours
    },
    upcomingExceptionalOpeningPeriods: {dates: Date[], type: string}[]
  },
  oEmbedUrl?: string
|}

class DefaultPageLayout extends Component<Props> {
  componentDidMount() {
    const { analyticsCategory, featuresCohort } = this.props;
    analytics({analyticsCategory, featuresCohort});
  }

  componentDidUpdate() {
    const { analyticsCategory, featuresCohort } = this.props;
    analytics({analyticsCategory, featuresCohort});
  }

  render() {
    const {
      title,
      type,
      canonicalUrl,
      description,
      imageUrl,
      siteSection,
      children,
      featuresCohort,
      featureFlags,
      isPreview,
      openingTimes,
      oEmbedUrl
    } = this.props;

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
          <script type='application/ld+json'>{/* JSON+LD Z */}</script>
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
          <div id='main' className='main' role='main'>
            {children}
          </div>
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

class DPLWithLoader extends Component<Props> {
  componentDidMount = () => {
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
  }

  render() {
    return <DefaultPageLayout {...this.props} />;
  }
}

export default DPLWithLoader;
