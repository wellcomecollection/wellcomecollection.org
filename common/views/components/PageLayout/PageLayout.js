// @flow
import type { Node } from 'react';
import type { Url } from '../../../model/url';
import type { JsonLdObj } from '../JsonLd/JsonLd';
import { Fragment, useContext } from 'react';
import Head from 'next/head';
import convertUrlToString from '../../../utils/convert-url-to-string';
import Header from '../Header/Header';
// $FlowFixMe (tsx)
import InfoBanner from '../InfoBanner/InfoBanner';
import CookieNotice from '../CookieNotice/CookieNotice';
import NewsletterPromo from '../NewsletterPromo/NewsletterPromo';
import Footer from '../Footer/Footer';
// $FlowFixMe (tsx)
import PopupDialogContext from '../PopupDialogContext/PopupDialogContext';
// $FlowFixMe (tsx)
import PopupDialog from '../PopupDialog/PopupDialog';
import OpeningTimesContext from '../OpeningTimesContext/OpeningTimesContext';
import Space from '../styled/Space';
import GlobalAlertContext from '../GlobalAlertContext/GlobalAlertContext';
import { museumLd, libraryLd } from '../../../utils/json-ld';
import { collectionVenueId } from '../../../services/prismic/hardcoded-id';
import {
  getParseCollectionVenueById,
  openingHoursToOpeningHoursSpecification,
} from '../../../services/prismic/opening-times';
import { wellcomeCollectionGallery } from '../../../model/organization';

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
  const globalAlert = useContext(GlobalAlertContext);
  const popupDialog = useContext(PopupDialogContext);
  const openingTimes = useContext(OpeningTimesContext);
  const galleries = getParseCollectionVenueById(
    openingTimes,
    collectionVenueId.galleries.id
  );
  const library = getParseCollectionVenueById(
    openingTimes,
    collectionVenueId.libraries.id
  );
  const galleriesOpeningHours = galleries && galleries.openingHours;
  const libraryOpeningHours = library && library.openingHours;
  const wellcomeCollectionGalleryWithHours = {
    ...wellcomeCollectionGallery,
    ...openingHoursToOpeningHoursSpecification(galleriesOpeningHours),
  };
  const wellcomeLibraryWithHours = {
    ...wellcomeCollectionGallery,
    ...openingHoursToOpeningHoursSpecification(libraryOpeningHours),
  };

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              museumLd(wellcomeCollectionGalleryWithHours)
            ),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(libraryLd(wellcomeLibraryWithHours)),
          }}
        />
      </Head>

      <div>
        <CookieNotice />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <Header siteSection={siteSection} />

        {globalAlert &&
          globalAlert.isShown === 'show' &&
          (!globalAlert.routeRegex ||
            urlString.match(new RegExp(globalAlert.routeRegex))) && (
            <InfoBanner text={globalAlert.text} cookieName="WC_globalAlert" />
          )}

        {popupDialog.isShown && <PopupDialog {...popupDialog} />}

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

        <Footer
          hide={hideFooter}
          openingTimes={openingTimes}
          upcomingExceptionalOpeningPeriods={
            openingTimes.upcomingExceptionalOpeningPeriods
          }
        />
      </div>
    </Fragment>
  );
};
export default PageLayout;
