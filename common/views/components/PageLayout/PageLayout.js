// @flow
import { type Node, useContext } from 'react';
import type { Url } from '../../../model/url';
import type { JsonLdObj } from '../JsonLd/JsonLd';
import Head from 'next/head';
import convertUrlToString from '../../../utils/convert-url-to-string';
import Header from '../Header/Header';
// $FlowFixMe (tsx)
import InfoBanner from '../InfoBanner/InfoBanner';
import CookieNotice from '../CookieNotice/CookieNotice';
import NewsletterPromo from '../NewsletterPromo/NewsletterPromo';
import Footer from '../Footer/Footer';
import GlobalAlertContext from '../GlobalAlertContext/GlobalAlertContext';
// $FlowFixMe (tsx)
import PopupDialogContext from '../PopupDialogContext/PopupDialogContext';
// $FlowFixMe (tsx)
import PopupDialog from '../PopupDialog/PopupDialog';
import OpeningTimesContext from '../OpeningTimesContext/OpeningTimesContext';
import Space from '../styled/Space';
// $FlowFixMe (tsx)
import GlobalInfoBarContext from '../GlobalInfoBarContext/GlobalInfoBarContext';

type SiteSection =
  | 'collections'
  | 'what-we-do'
  | 'visit-us'
  | 'stories'
  | 'whats-on';

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
      : 'Wellcome Collection | A free museum and library exploring health and human experience';

  const absoluteUrl = `https://wellcomecollection.org${urlString}`;
  const globalInfoBar = useContext(GlobalInfoBarContext);
  return (
    <>
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
        {/* meta elements need to be contained as direct children of the Head element, so don't componentise the following */}
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

        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(jsonLd),
          }}
        />

        {rssUrl && (
          <link
            rel="alternate"
            href={rssUrl}
            title="RSS"
            type="application/rss+xml"
          />
        )}
      </Head>

      <div>
        <CookieNotice />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header siteSection={siteSection} />

        <GlobalAlertContext.Consumer>
          {globalAlert =>
            globalAlert &&
            globalAlert.isShown === 'show' &&
            (!globalAlert.routeRegex ||
              urlString.match(new RegExp(globalAlert.routeRegex))) && (
              <InfoBanner
                text={globalAlert.text}
                cookieName="WC_globalAlert"
                onVisibilityChange={isVisible => {
                  globalInfoBar.setIsVisible(isVisible);
                }}
              />
            )
          }
        </GlobalAlertContext.Consumer>
        <PopupDialogContext.Consumer>
          {({ isShown, ...props }) => isShown && <PopupDialog {...props} />}
        </PopupDialogContext.Consumer>
        <div id="main" className="main" role="main">
          {children}
        </div>
        {!hideNewsletterPromo && (
          <Space
            v={{
              size: 'xl',
              properties: ['padding-top', 'padding-bottom'],
            }}
          >
            <NewsletterPromo />
          </Space>
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
    </>
  );
};
export default PageLayout;
