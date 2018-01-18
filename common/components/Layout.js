import Head from 'next/head';
import HeadJs from './HeadJs';
import Header from './Header';

// TODO: Hashed files
// TODO: Analytics
// TODO: Inline CSS
// TODO: JsonLd
// TODO: Feature flags / cohort
// TODO: Twiiter script
// TODO: Set the props
// TODO: InSection

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

export default ({
  children,
  title,
  pageMeta,
  canonicalUri,
  siteSection,
  featuresCohort = 'default',
  featureFlags = [],
  isPreview = false
}) => (

<div>
  <Head>
    <meta charSet="utf-8" />
    {/* Analytics */}
    <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1"/>
    <title>{title && `${title} | `}Wellcome Collection</title>
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="theme-color" content="#000000"/>
    {pageMeta}

    {/* CSS */}

    <link rel='preload' href='/static/css/non-critical.css' as="style" onLoad='this.rel="stylesheet"' />
    <link rel='apple-touch-icon' sizes='180x180' href='/static/icons/apple-touch-icon.png' />
    <link rel='shortcut icon' href='/static/icons/favicon.ico' type='image/ico' />
    <link rel='icon' type='image/png' href='/static/icons/favicon-32x32.png' sizes="32x32" />
    <link rel='icon' type='image/png' href='/static/icons/favicon-16x16.png' sizes="16x16" />
    <link rel='manifest' href='/static/icons/manifest.json' />
    <link rel='mask-icon' href='/static/icons/safari-pinned-tab.svg' color='#000000' />
    <script src='/static/libs/picturefill.min.js' async />
    {/* Leaving this out for now as it's hanging locally for me */}
    {/*<script src='//platform.twitter.com/widgets.js' async defer></script>*/}
    <HeadJs />
    <script type="application/ld+json">{/* JSON+LD Z*/}</script>
    <script dangerouslySetInnerHTML={{ __html: `
      window.WC = {
        featuresCohort: ${JSON.stringify(featuresCohort)},
        featureFlags: ${JSON.stringify(featureFlags)}
      }
    `}} />
    {canonicalUri && <link rel="canonical" href={canonicalUri} />}
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
