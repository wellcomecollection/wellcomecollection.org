// @flow
import type { Node } from 'react';
import type { Url } from '../../../model/url';
import type { JsonLdObj } from '../JsonLd/JsonLd';
import { Fragment } from 'react';
import Head from 'next/head';
import convertUrlToString from '../../../utils/convert-url-to-string';
import JsonLd from '../JsonLd/JsonLd';
import Header from '../Header/Header';
import InfoBanner from '../InfoBanner/InfoBanner';
import NewsletterPromo from '../NewsletterPromo/NewsletterPromo';
import NewsletterPromoDeprecated from '../NewsletterPromo/NewsletterPromoDeprecated';
import Footer from '../Footer/Footer';
import GlobalAlertContext from '../GlobalAlertContext/GlobalAlertContext';
import OpeningTimesContext from '../OpeningTimesContext/OpeningTimesContext';
import Space from '../styled/Space';
import TogglesContext from '../TogglesContext/TogglesContext';

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
  hideFooter?: boolean,
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
  hideFooter = false,
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
        <meta property="og:site_name" content="Wellcome Collection" />
        <meta property="og:type" content={openGraphType} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl} />
        {/* we add itemprop="image" as it's required for WhatsApp */}
        {imageUrl && (
          <meta
            key="og:image"
            property="og:image"
            content={imageUrl}
            itemProp="image"
          />
        )}
        {imageUrl && (
          <meta key="og:image:width" property="og:image:width" content="1200" />
        )}
        <meta
          key="twitter:card"
          name="twitter:card"
          content="summary_large_image"
        />
        <meta
          key="twitter:site"
          name="twitter:site"
          content="@ExploreWellcome"
        />
        <meta key="twitter:url" name="twitter:url" content={absoluteUrl} />
        <meta key="twitter:title" name="twitter:title" content={title} />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={description}
        />
        <meta key="twitter:image" name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content={imageAltText} />
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
        {!hideNewsletterPromo && (
          <TogglesContext.Consumer>
            {({ newNewsletterPromo }) =>
              !newNewsletterPromo ? (
                <Space
                  v={{
                    size: 'xl',
                    properties: ['padding-top', 'padding-bottom'],
                  }}
                >
                  <NewsletterPromo />
                </Space>
              ) : (
                <NewsletterPromoDeprecated />
              )
            }
          </TogglesContext.Consumer>
        )}
        <OpeningTimesContext.Consumer>
          {openingTimes => (
            <Footer
              hide={hideFooter}
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
