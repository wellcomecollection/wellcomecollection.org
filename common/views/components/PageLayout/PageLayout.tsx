import React, { useContext, FunctionComponent, ReactNode } from 'react';
import { Url } from '../../../model/link-props';
import { JsonLdObj } from '../JsonLd/JsonLd';
import Head from 'next/head';
import Script from 'next/script';
import convertUrlToString from '../../../utils/convert-url-to-string';
import Header, { NavLink } from '../Header/Header';
import InfoBanner from '../InfoBanner/InfoBanner';
import CookieNotice from '../CookieNotice/CookieNotice';
import NewsletterPromo from '../NewsletterPromo/NewsletterPromo';
import Footer from '../Footer';
import PopupDialog from '../PopupDialog/PopupDialog';
import Space from '../styled/Space';
import { museumLd, libraryLd, openingHoursLd } from '../../../utils/json-ld';
import { collectionVenueId } from '../../../data/hardcoded-ids';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import { getVenueById } from '../../../services/prismic/opening-times';
import { wellcomeCollectionGallery } from '../../../data/organization';
import GlobalInfoBarContext, {
  GlobalInfoBarContextProvider,
} from '../GlobalInfoBarContext/GlobalInfoBarContext';
import ApiToolbar, { ApiToolbarLink } from '../ApiToolbar';
import { usePrismicData, useToggles } from '../../../server-data/Context';
import { defaultPageTitle } from '@weco/common/data/microcopy';
import { getCrop, ImageType } from '@weco/common/model/image';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import cookies from '@weco/common/data/cookies';
import { isNotUndefined } from '@weco/common/utils/array';
import ConditionalWrapper from '@weco/common/views/components/ConditionalWrapper/ConditionalWrapper';

export type SiteSection =
  | 'collections'
  | 'what-we-do'
  | 'visit-us'
  | 'stories'
  | 'whats-on'
  | 'identity'
  | 'exhibition-guides';

type HeaderProps = {
  customNavLinks: NavLink[];
  isMinimalHeader?: boolean;
};

type SkipToContentLink = {
  anchorId: string;
  label: string;
};

export type Props = {
  title: string;
  description: string;
  url: Url;
  jsonLd: JsonLdObj | JsonLdObj[];
  openGraphType: 'website' | 'article' | 'book' | 'profile' | 'video' | 'music';
  siteSection: SiteSection | null;
  image?: ImageType;
  rssUrl?: string;
  children: ReactNode;
  hideNewsletterPromo?: boolean;
  hideFooter?: boolean;
  excludeRoleMain?: boolean;
  headerProps?: HeaderProps;
  apiToolbarLinks?: (ApiToolbarLink | undefined)[];
  skipToContentLinks?: SkipToContentLink[];
};

const PageLayoutComponent: FunctionComponent<Props> = ({
  title,
  description,
  url,
  jsonLd,
  openGraphType,
  siteSection,
  image,
  rssUrl,
  children,
  hideNewsletterPromo = false,
  hideFooter = false,
  excludeRoleMain = false,
  headerProps,
  apiToolbarLinks = [],
  skipToContentLinks = [],
}) => {
  const { apiToolbar } = useToggles();
  const urlString = convertUrlToString(url);
  const fullTitle =
    title !== ''
      ? `${title} | Wellcome Collection`
      : `Wellcome Collection | ${defaultPageTitle}`;

  const absoluteUrl = `https://wellcomecollection.org${urlString}`;
  const { popupDialog, collectionVenues, globalAlert } = usePrismicData();
  const venues = transformCollectionVenues(collectionVenues);
  const galleries =
    venues && getVenueById(venues, collectionVenueId.galleries.id);
  const library =
    venues && getVenueById(venues, collectionVenueId.libraries.id);
  const galleriesOpeningHours = galleries && galleries.openingHours;
  const libraryOpeningHours = library && library.openingHours;
  const wellcomeCollectionGalleryWithHours = {
    ...wellcomeCollectionGallery,
    ...openingHoursLd(galleriesOpeningHours),
  };
  const wellcomeLibraryWithHours = {
    ...wellcomeCollectionGallery,
    ...openingHoursLd(libraryOpeningHours),
  };

  const polyfillVersion = '3.103.0';
  const polyfillFeatures = [
    'default',
    'AbortController',
    'Array.prototype.find',
    'Array.prototype.flat',
    'Array.prototype.flatMap',
    'Array.prototype.includes',
    'Intl.DateTimeFormat',
    'Object.entries',
    'Object.fromEntries',
    'Object.values',
    'WeakMap',
    'URL',
    'URLSearchParams',
  ];

  const globalInfoBar = useContext(GlobalInfoBarContext);

  // For Twitter cards in particular, we prefer a crop as close to 2:1 as
  // possible.  This avoids an automated crop by Twitter, which may be less
  // appropriate or preferable than the one we've selected.
  //
  // The closest we have in our selection of crops is 32:15, so we use that.
  // If no such crop is available, fall back to the full-sized image.
  //
  // See https://github.com/wellcomecollection/wellcomecollection.org/issues/7641
  // for an example of how this can go wrong.
  //
  // See https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/summary-card-with-large-image
  // for more information on Twitter cards.
  const socialPreviewCardImage = getCrop(image, '32:15') || image;

  const imageUrl =
    socialPreviewCardImage &&
    convertImageUri(socialPreviewCardImage.contentUrl, 800);
  const imageAltText = socialPreviewCardImage?.alt || '';

  // In general we use large, landscape, photographs or images for our social media
  // card previews.
  //
  // If that's not available, we fall back to a small black square with the white
  // "Wellcome Collection" logo, that we use for our social media avatars.
  const fallbackImageUrl =
    'https://i.wellcomecollection.org/assets/icons/square_icon.png';

  return (
    <>
      <Head>
        <meta property="next:version" content="13" />
        <title>{fullTitle}</title>
        <meta name="description" content={description || ''} />
        <link rel="canonical" href={absoluteUrl} />
        {/* meta elements need to be contained as direct children of the Head element, so don't componentise the following */}
        <meta property="og:site_name" content="Wellcome Collection" />
        <meta property="og:type" content={openGraphType} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:url" content={absoluteUrl} />
        <meta
          key="og:image"
          property="og:image"
          content={imageUrl || fallbackImageUrl}
          itemProp="image" // itemProp is required for WhatsApp
        />

        {/*
          The next two properties control whether we show a big image that fills the
          screen, or just a small logo off to one side.
        */}
        {imageUrl && (
          <meta key="og:image:width" property="og:image:width" content="1200" />
        )}
        <meta
          key="twitter:card"
          name="twitter:card"
          content={imageUrl ? 'summary_large_image' : 'summary'}
        />

        <meta
          key="twitter:site"
          name="twitter:site"
          content="@ExploreWellcome"
        />
        <meta key="twitter:url" name="twitter:url" content={absoluteUrl} />
        <meta
          key="twitter:title"
          name="twitter:title"
          content={title || 'Wellcome Collection'}
        />
        <meta
          key="twitter:description"
          name="twitter:description"
          content={description}
        />
        <meta key="twitter:image" name="twitter:image" content={imageUrl} />
        <meta name="twitter:image:alt" content={imageAltText} />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge,chrome=1" />
        <Script
          src={`https://cdn.polyfill.io/v3/polyfill.js?version=${polyfillVersion}&features=${polyfillFeatures.join(
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
        <Script
          src="https://i.wellcomecollection.org/assets/libs/picturefill.min.js"
          async
        />

        <Script
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
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(
              museumLd(wellcomeCollectionGalleryWithHours)
            ),
          }}
        />
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(libraryLd(wellcomeLibraryWithHours)),
          }}
        />
      </Head>

      <div id="root">
        {apiToolbar && (
          <ApiToolbar links={apiToolbarLinks.filter(isNotUndefined)} />
        )}
        <CookieNotice source={url.pathname || ''} />

        {skipToContentLinks.map(({ anchorId, label }) => (
          <a
            className="visually-hidden visually-hidden-focusable"
            href={`#${anchorId}`}
            key={anchorId}
          >
            {label}
          </a>
        ))}

        <a className="visually-hidden visually-hidden-focusable" href="#main">
          Skip to main content
        </a>

        <Header siteSection={siteSection} {...headerProps} />

        {globalAlert.data.isShown === 'show' &&
          (!globalAlert.data.routeRegex ||
            urlString.match(new RegExp(globalAlert.data.routeRegex))) && (
            <InfoBanner
              document={globalAlert}
              cookieName={cookies.globalAlert}
              onVisibilityChange={isVisible => {
                globalInfoBar.setIsVisible(isVisible);
              }}
            />
          )}
        {popupDialog.data.isShown && <PopupDialog document={popupDialog} />}
        <div
          id="main"
          className="main"
          role={excludeRoleMain ? undefined : 'main'}
          // We need tabIndex="-1" so the "Skip to main content" link works for
          // screen readers.
          //
          // See e.g. https://accessibility.oit.ncsu.edu/it-accessibility-at-nc-state/developers/accessibility-handbook/mouse-and-keyboard-events/skip-to-main-content/
          tabIndex={-1}
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
        {/* The no javascript version of the burger menu relies on the footer being present on the page,
        as we then use an anchor link to take people to the navigation links in the footer.
        Instead of completely removing the footer when we don't want it, we wrap it in a noscript tag,
        so teh degraded experience still works.
        */}
        <ConditionalWrapper
          condition={Boolean(hideFooter)}
          wrapper={children => <noscript>{children}</noscript>}
        >
          <Footer venues={venues} />
        </ConditionalWrapper>
      </div>
    </>
  );
};

const PageLayout: FunctionComponent<Props> = (props: Props) => {
  return (
    <GlobalInfoBarContextProvider>
      <PageLayoutComponent {...props} />
    </GlobalInfoBarContextProvider>
  );
};

export default PageLayout;
