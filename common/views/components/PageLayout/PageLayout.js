// @flow
import type { Node } from 'react';
import type { Url } from '../../../model/url';
import type { JsonLdObj } from '../JsonLd/JsonLd';
import { Fragment } from 'react';
import Head from 'next/head';
import convertUrlToString from '../../../utils/convert-url-to-string';
import OpenGraphMetadata from '../OpenGraphMetadata/OpenGraphMetadata';
import TwitterMetadata from '../TwitterMetadata/TwitterMetadata';
import JsonLd from '../JsonLd/JsonLd';
import Header from '../Header/Header';
import InfoBanner from '../InfoBanner/InfoBanner';
import NewsletterPromo from '../NewsletterPromo/NewsletterPromo';
import Footer from '../Footer/Footer';
import GlobalAlertContext from '../GlobalAlertContext/GlobalAlertContext';
import OpeningTimesContext from '../OpeningTimesContext/OpeningTimesContext';

type SiteSection = 'works' | 'what-we-do' | 'visit-us' | 'stories' | 'whats-on';

export type Props = {|
  title: string,
  description: string,
  url: Url,
  jsonLd: JsonLdObj | JsonLdObj[],
  openGraphType: 'website' | 'article' | 'book' | 'profile',
  siteSection: ?SiteSection,
  imageUrl: ?string,
  imageAltText: ?string,
  oEmbedUrl?: string,
  rssUrl?: string,
  children: Node,
  hideNewsletterPromo?: boolean,
|};

const PageLayout = ({
  title,
  description,
  url,
  jsonLd,
  openGraphType,
  siteSection,
  imageUrl,
  imageAltText,
  oEmbedUrl,
  rssUrl,
  children,
  hideNewsletterPromo = false,
}: Props) => {
  const urlString = convertUrlToString(url);
  const fullTitle =
    title !== ''
      ? `${title} | Wellcome Collection`
      : 'Wellcome Collection | The free museum and library for the incurably curious';

  const absoluteUrl = `https://wellcomecollection.org${urlString}`;
  const isPreview = false;
  return (
    <Fragment>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || ''} />
        <link rel="canonical" href={absoluteUrl} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
        {oEmbedUrl && (
          <link
            rel="alternate"
            type="application/json+oembed"
            href={oEmbedUrl}
            title={title}
          />
        )}

        <OpenGraphMetadata
          type={openGraphType}
          title={title}
          description={description}
          url={absoluteUrl}
          imageUrl={imageUrl || ''}
        />

        <TwitterMetadata
          title={title}
          description={description}
          url={absoluteUrl}
          imageUrl={imageUrl || ''}
          imageAltText={imageAltText || ''}
        />

        <JsonLd data={jsonLd} />

        {rssUrl && (
          <link
            rel="alternate"
            href={rssUrl}
            title="RSS"
            type="application/rss+xml"
          />
        )}
      </Head>

      <div className={isPreview ? 'is-preview' : undefined}>
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header siteSection={siteSection} />
        <GlobalAlertContext.Consumer>
          {globalAlert =>
            globalAlert.isShown === 'show' && (
              <InfoBanner text={globalAlert.text} cookieName="WC_globalAlert" />
            )
          }
        </GlobalAlertContext.Consumer>
        <div id="main" className="main" role="main">
          {children}
        </div>
        {!hideNewsletterPromo && <NewsletterPromo />}
        <OpeningTimesContext.Consumer>
          {openingTimes => (
            <Footer
              openingTimes={openingTimes}
              upcomingExceptionalOpeningPeriods={
                openingTimes.upcomingExceptionalOpeningPeriods
              }
            />
          )}
        </OpeningTimesContext.Consumer>
      </div>
    </Fragment>
  );
};
export default PageLayout;
