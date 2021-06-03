import React, { useContext, FunctionComponent, ReactNode } from 'react';
import { Url } from '../../../model/link-props';
import { JsonLdObj } from '../JsonLd/JsonLd';
import Head from 'next/head';
import convertUrlToString from '../../../utils/convert-url-to-string';
// $FlowFixMe (tsx)
import Header from '../Header/Header';
import InfoBanner from '../InfoBanner/InfoBanner';
import CookieNotice from '../CookieNotice/CookieNotice';
import NewsletterPromo from '../NewsletterPromo/NewsletterPromo';
import Footer from '../Footer/Footer';
import PopupDialogContext from '../PopupDialogContext/PopupDialogContext';
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
import GlobalContextProvider, {
  GlobalContextData,
} from '../GlobalContextProvider/GlobalContextProvider';
import GlobalInfoBarContext, {
  GlobalInfoBarContextProvider,
} from '../GlobalInfoBarContext/GlobalInfoBarContext';
import TogglesContext from '../TogglesContext/TogglesContext';
import ApiToolbar from '../ApiToolbar/ApiToolbar';
import { UserInfoProvider } from '@weco/identity/src/frontend/MyAccount/UserInfoContext';

type SiteSection =
  | 'collections'
  | 'what-we-do'
  | 'visit-us'
  | 'stories'
  | 'whats-on'
  | 'identity';

type ComponentProps = {
  title: string;
  description: string;
  url: Url;
  jsonLd: JsonLdObj | JsonLdObj[];
  openGraphType: 'website' | 'article' | 'book' | 'profile';
  siteSection: SiteSection | null;
  imageUrl: string | undefined;
  imageAltText: string | undefined;
  rssUrl?: string;
  children: ReactNode;
  hideNewsletterPromo?: boolean;
  hideFooter?: boolean;
  excludeRoleMain?: boolean;
};

const PageLayoutComponent: FunctionComponent<ComponentProps> = ({
  title,
  description,
  url,
  jsonLd,
  openGraphType,
  siteSection,
  imageUrl,
  imageAltText,
  rssUrl,
  children,
  hideNewsletterPromo = false,
  hideFooter = false,
  excludeRoleMain = false,
}: ComponentProps) => {
  const { apiToolbar } = useContext(TogglesContext);
  const urlString = convertUrlToString(url);
  const fullTitle =
    title !== ''
      ? `${title} | Wellcome Collection`
      : 'Wellcome Collection | A free museum and library exploring health and human experience';

  const absoluteUrl = `https://wellcomecollection.org${urlString}`;
  const globalAlert = useContext(GlobalAlertContext);
  const popupDialog = useContext(PopupDialogContext);
  const openingTimes = useContext(OpeningTimesContext);
  const galleries =
    openingTimes &&
    getParseCollectionVenueById(openingTimes, collectionVenueId.galleries.id);
  const library =
    openingTimes &&
    getParseCollectionVenueById(openingTimes, collectionVenueId.libraries.id);
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

  const polyfillFeatures = [
    'default',
    'Array.prototype.find',
    'Array.prototype.includes',
    'Array.prototype.includes',
    'Object.entries',
    'WeakMap',
    'URL',
  ];

  const globalInfoBar = useContext(GlobalInfoBarContext);
  return (
    <>
      <Head>
        <title>{fullTitle}</title>
        <meta name="description" content={description || ''} />
        <link rel="canonical" href={absoluteUrl} />
        {imageUrl && <meta property="og:image" content={imageUrl} />}
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
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <script
          src={`https://cdn.polyfill.io/v3/polyfill.js?features=${polyfillFeatures.join(
            ','
          )}`}
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="https://i.wellcomecollection.org/assets/icons/apple-touch-icon.png"
        />
        <link
          rel="shortcut icon"
          href="https://i.wellcomecollection.org/assets/icons/favicon.ico"
          type="image/ico"
        />
        <link
          rel="icon"
          type="image/png"
          href="https://i.wellcomecollection.org/assets/icons/favicon-32x32.png"
          sizes="32x32"
        />
        <link
          rel="icon"
          type="image/png"
          href="https://i.wellcomecollection.org/assets/icons/favicon-16x16.png"
          sizes="16x16"
        />
        <link
          rel="manifest"
          href="https://i.wellcomecollection.org/assets/icons/manifest.json"
        />
        <link
          rel="mask-icon"
          href="https://i.wellcomecollection.org/assets/icons/safari-pinned-tab.svg"
          color="#000000"
        />
        <script
          src="https://i.wellcomecollection.org/assets/libs/picturefill.min.js"
          async
        />

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
        {apiToolbar && <ApiToolbar />}
        <CookieNotice />
        <a className="skip-link" href="#main">
          Skip to main content
        </a>
        <UserInfoProvider>
          <Header siteSection={siteSection} />
        </UserInfoProvider>
        {globalAlert &&
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
          )}
        {popupDialog && popupDialog.isShown && <PopupDialog {...popupDialog} />}
        <div
          id="main"
          className="main"
          role={excludeRoleMain ? undefined : 'main'}
        >
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
            openingTimes && openingTimes.upcomingExceptionalOpeningPeriods
          }
        />
      </div>
    </>
  );
};

export type Props = {
  globalContextData: GlobalContextData;
} & ComponentProps;

const PageLayout: FunctionComponent<Props> = ({
  globalContextData,
  ...props
}: Props) => {
  return (
    <GlobalContextProvider value={globalContextData}>
      <GlobalInfoBarContextProvider>
        <PageLayoutComponent {...props} />
      </GlobalInfoBarContextProvider>
    </GlobalContextProvider>
  );
};

export default PageLayout;
