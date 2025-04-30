import Head from 'next/head';
import Script from 'next/script';
import { FunctionComponent, PropsWithChildren } from 'react';

import { useAppContext } from '@weco/common/contexts/AppContext';
import {
  GlobalInfoBarContextProvider,
  useGlobalInfoBarContext,
} from '@weco/common/contexts/GlobalInfoBarContext';
import { useSearchContext } from '@weco/common/contexts/SearchContext';
import cookies from '@weco/common/data/cookies';
import { collectionVenueId } from '@weco/common/data/hardcoded-ids';
import { defaultPageTitle } from '@weco/common/data/microcopy';
import { wellcomeCollectionGallery } from '@weco/common/data/organization';
import { getCrop, ImageType } from '@weco/common/model/image';
import { Url } from '@weco/common/model/link-props';
import { SiteSection } from '@weco/common/model/site-section';
import { usePrismicData, useToggles } from '@weco/common/server-data/Context';
import { getVenueById } from '@weco/common/services/prismic/opening-times';
import { transformCollectionVenues } from '@weco/common/services/prismic/transformers/collection-venues';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import convertUrlToString from '@weco/common/utils/convert-url-to-string';
import {
  libraryLd,
  museumLd,
  openingHoursLd,
} from '@weco/common/utils/json-ld';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import ApiToolbar, {
  ApiToolbarLink,
} from '@weco/common/views/components/ApiToolbar';
import Footer from '@weco/common/views/components/Footer';
import Header, { NavLink } from '@weco/common/views/components/Header';
import {
  InfoBanner,
  WebsiteIssuesBanner,
} from '@weco/common/views/components/InfoBanners';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import NewsletterPromo from '@weco/common/views/components/NewsletterPromo';
import PopupDialog from '@weco/common/views/components/PopupDialog';

type HeaderProps = {
  customNavLinks: NavLink[];
  isMinimalHeader?: boolean;
};

type SkipToContentLink = {
  anchorId: string;
  label: string;
};

export type Props = PropsWithChildren<{
  title: string;
  description: string;
  url: Url;
  jsonLd: JsonLdObj | JsonLdObj[];
  openGraphType: 'website' | 'article' | 'book' | 'profile' | 'video' | 'music';
  siteSection?: SiteSection;
  image?: ImageType;
  rssUrl?: string;
  hideNewsletterPromo?: boolean;
  hideFooter?: boolean;
  hideHeader?: boolean;
  excludeRoleMain?: boolean;
  headerProps?: HeaderProps;
  apiToolbarLinks?: (ApiToolbarLink | undefined)[];
  skipToContentLinks?: SkipToContentLink[];
}>;

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
  hideHeader = false,
  excludeRoleMain = false,
  headerProps,
  apiToolbarLinks = [],
  skipToContentLinks = [],
}) => {
  const { apiToolbar, issuesBanner } = useToggles();
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

  const globalInfoBar = useGlobalInfoBarContext();
  const { extraApiToolbarLinks } = useSearchContext();
  const { isEnhanced } = useAppContext();

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
        <title>{fullTitle}</title>
        <meta key="metadescription" name="description" content={description} />
        <link rel="canonical" href={absoluteUrl} />
        {/* meta elements need to be contained as direct children of the Head element, so don't componentise the following */}
        <meta
          key="og:sitename"
          property="og:site_name"
          content="Wellcome Collection"
        />
        <meta key="og:type" property="og:type" content={openGraphType} />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        <meta key="og:url" property="og:url" content={absoluteUrl} />
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
        <meta
          key="twitter:image:alt"
          name="twitter:image:alt"
          content={imageAltText}
        />
        <meta
          key="httpEquiv"
          httpEquiv="X-UA-Compatible"
          content="IE=edge,chrome=1"
        />
        <meta
          key="viewport"
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
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

        {rssUrl && (
          <link
            rel="alternate"
            href={rssUrl}
            title="RSS"
            type="application/rss+xml"
          />
        )}
      </Head>

      {/* Note: these <Script> tags are very deliberately:

          - not <script>
          - not in the <Head>

          When we put <script> tags in the <Head>, we saw issues with Next.js doubling-up certain
          elements in the final <head>, e.g. the charset declaration.

          When we put <Script> tags in the <Head>, they didn't appear in the rendered page.

      */}

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
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(museumLd(wellcomeCollectionGalleryWithHours)),
        }}
      />
      <Script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(libraryLd(wellcomeLibraryWithHours)),
        }}
      />

      <div id="root">
        {apiToolbar && (
          <ApiToolbar
            links={[
              ...apiToolbarLinks.filter(isNotUndefined),
              ...extraApiToolbarLinks.filter(isNotUndefined),
            ]}
          />
        )}

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
        {!hideHeader && <Header siteSection={siteSection} {...headerProps} />}
        {issuesBanner && <WebsiteIssuesBanner />}
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
        {popupDialog?.data?.isShown &&
          (!popupDialog.data.routeRegex ||
            urlString.match(new RegExp(popupDialog.data.routeRegex))) && (
            <PopupDialog document={popupDialog} />
          )}
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

        {!hideNewsletterPromo && <NewsletterPromo />}

        {/* The no javascript version of the burger menu relies on the footer being present on the page,
        as we then use an anchor link to take people to the navigation links in the footer.
        We only completely remove the footer if you've got JS. If we've hidden the header, then we don't need to worry about this because the navigation links aren't there at all */}
        {(!hideFooter || !isEnhanced) && <Footer venues={venues} />}
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
