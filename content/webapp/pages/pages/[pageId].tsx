import { EditorialImageSlice as RawEditorialImageSlice } from '@weco/common/prismicio-types';
import { FunctionComponent, ReactElement } from 'react';
import PageLayout, {
  SiteSection,
} from '@weco/common/views/components/PageLayout/PageLayout';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import ImageWithTasl from '@weco/content/components/ImageWithTasl/ImageWithTasl';
import PrismicImage from '@weco/common/views/components/PrismicImage/PrismicImage';
import { Page as PageType } from '@weco/content/types/pages';
import { SiblingsGroup } from '@weco/content/types/siblings-group';
import {
  headerBackgroundLs,
  landingHeaderBackgroundLs,
} from '@weco/common/utils/backgrounds';
import {
  prismicPageIds,
  sectionLevelPages,
} from '@weco/common/data/hardcoded-ids';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SectionHeader from '@weco/content/components/SectionHeader/SectionHeader';
import { PageFormatIds } from '@weco/content/data/content-format-ids';
import { links } from '@weco/common/views/components/Header/Header';
import { Props as LabelsListProps } from '@weco/common/views/components/LabelsList/LabelsList';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { GetServerSideProps } from 'next';
import { serialiseProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import CardGrid from '@weco/content/components/CardGrid/CardGrid';
import Body from '@weco/content/components/Body/Body';
import ContentPage from '@weco/content/components/ContentPage/ContentPage';
import { contentLd } from '@weco/content/services/prismic/transformers/json-ld';
import {
  fetchChildren,
  fetchPage,
  fetchSiblings,
} from '@weco/content/services/prismic/fetch/pages';
import { createClient } from '@weco/content/services/prismic/fetch';
import { transformPage } from '@weco/content/services/prismic/transformers/pages';
import { getCrop } from '@weco/common/model/image';
import { isEditorialImage, isVideoEmbed } from '@weco/content/types/body';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { JsonLdObj } from '@weco/common/views/components/JsonLd/JsonLd';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import {
  transformEditorialImageSlice,
  transformEmbedSlice,
} from '@weco/content/services/prismic/transformers/body';
import { gridSize12 } from '@weco/common/views/components/Layout';

export type Props = {
  page: PageType;
  vanityUrl: string | undefined;
  siblings: SiblingsGroup<PageType>[];
  children: SiblingsGroup<PageType>;
  ordersInParents: OrderInParent[];
  staticContent: ReactElement | null;
  postOutroContent: ReactElement | null;
  jsonLd: JsonLdObj;
  gaDimensions: GaDimensions;
};

type OrderInParent = {
  id: string;
  title: string;
  order: number;
  type: 'pages' | 'exhibitions';
};

/** Is this URL a vanity URL?
 *
 * e.g. /visit-us instead of /pages/X8ZTSBIAACQAiDzY
 *
 * It's moderately fiddly to get all the defined vanity URLs out of the
 * app controller, so we use a heuristic instead.
 */
function isVanityUrl(pageId: string, url: string): boolean {
  // Does this URL contain a page ID?  We look for the page ID rather
  // than a specific prefix, because this template is used for multiple
  // types of Prismic content.
  //
  // e.g. /pages/X8ZTSBIAACQAiDzY, /projects/X_SRxhEAACQAPbwS
  const containsPageId = url.includes(pageId);

  // This should match a single alphanumeric slug directly after the /
  //
  // e.g. /visit-us, /collections
  const looksLikeVanityUrl = url.match(/\/[a-z-]+/) !== null;

  return !containsPageId && looksLikeVanityUrl;
}

function getFeaturedPictureWithTasl(editorialImage: RawEditorialImageSlice) {
  const featuredPicture = transformEditorialImageSlice(editorialImage);
  const image =
    getCrop(featuredPicture.value.image, '16:9') || featuredPicture.value.image;

  return (
    <ImageWithTasl
      Image={
        <PrismicImage
          image={image}
          sizes={{
            xlarge: 1,
            large: 1,
            medium: 1,
            small: 1,
          }}
          quality="low"
        />
      }
      tasl={image?.tasl}
    />
  );
}

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { pageId } = context.query;

  if (!looksLikePrismicId(pageId)) {
    return { notFound: true };
  }

  const client = createClient(context);

  const vanityUrl = isVanityUrl(pageId, context.resolvedUrl)
    ? context.resolvedUrl
    : undefined;

  const pageLookup = await fetchPage(client, pageId);
  const page = pageLookup && transformPage(pageLookup);

  if (isNotUndefined(page)) {
    const serverData = await getServerData(context);
    const siblings: SiblingsGroup<PageType>[] = (
      await fetchSiblings(client, page)
    ).map(group => {
      return {
        ...group,
        siblings: group.siblings.map(transformPage),
      };
    });
    const ordersInParents: OrderInParent[] =
      page.parentPages.map(p => {
        return {
          id: p.id,
          title: p.title,
          order: p.order,
          type: p.type,
        };
      }) || [];

    // TODO: Why are we putting 'children' in a 'siblings' attribute?
    // Fix this janky naming.
    const children = {
      id: page.id,
      title: page.title,
      siblings: (await fetchChildren(client, page)).map(transformPage),
    };

    const jsonLd = contentLd(page);

    return {
      props: serialiseProps({
        page,
        siblings,
        children,
        ordersInParents,
        staticContent: null,
        postOutroContent: null,
        jsonLd,
        serverData,
        vanityUrl,
        gaDimensions: {
          partOf: page.seasons.map(season => season.id),
        },
      }),
    };
  }

  return { notFound: true };
};

export const Page: FunctionComponent<Props> = ({
  page,
  siblings,
  children,
  ordersInParents,
  staticContent,
  postOutroContent,
  vanityUrl,
  jsonLd,
}) => {
  function makeLabels(title?: string): LabelsListProps | undefined {
    if (!title) return;

    return { labels: [{ text: title }] };
  }

  const DateInfo = page.datePublished && <HTMLDate date={page.datePublished} />;
  const isLanding = page.format && page.format.id === PageFormatIds.Landing;
  const labels =
    !isLanding && page.format?.title
      ? makeLabels(page.format?.title)
      : undefined;

  const backgroundTexture = isLanding
    ? landingHeaderBackgroundLs
    : headerBackgroundLs;

  const featuredPicture =
    page.untransformedBody.length > 1 &&
    isEditorialImage(page.untransformedBody[0])
      ? page.untransformedBody[0]
      : undefined;

  const featuredVideo =
    page.untransformedBody.length > 1 && isVideoEmbed(page.untransformedBody[0])
      ? page.untransformedBody[0]
      : undefined;

  const transformFeaturedVideo =
    featuredVideo && transformEmbedSlice(featuredVideo);

  const hasFeaturedMedia =
    isNotUndefined(featuredPicture) || isNotUndefined(featuredVideo);

  const untransformedBody = hasFeaturedMedia
    ? page.untransformedBody.slice(1, page.untransformedBody.length)
    : page.untransformedBody;

  const featuredMedia = featuredPicture ? (
    getFeaturedPictureWithTasl(featuredPicture)
  ) : transformFeaturedVideo ? (
    <VideoEmbed {...transformFeaturedVideo.value} />
  ) : undefined;

  const hiddenBreadcrumbPages = [prismicPageIds.covidWelcomeBack];

  const sectionLevelPage = sectionLevelPages.includes(page.id);

  function getBreadcrumbText(siteSection: string): string {
    return hiddenBreadcrumbPages.includes(page.id) || isLanding
      ? '\u200b'
      : links.find(link => link.siteSection === siteSection)?.title ||
          siteSection;
  }

  // TODO: This is not the way to do site sections
  // Note: the 'About Us' page is a bit unusual, because it's the only top-level
  // item in the site header which shows a breadcrumb, so we need to avoid
  // triplicating it in the breadcrumb/header/page title.
  const sectionItem =
    page.id !== prismicPageIds.aboutUs && page.siteSection
      ? [
          {
            text: getBreadcrumbText(page.siteSection),
            url: page.siteSection ? `/${page.siteSection}` : '',
          },
        ]
      : [];

  const breadcrumbs = {
    items: [
      ...sectionItem,
      ...ordersInParents.map(siblingGroup => ({
        url: `/${siblingGroup.type}/${siblingGroup.id}`,
        text: siblingGroup.title || '',
        prefix: `Part ${siblingGroup.order || ''} of`,
      })),
    ],
  };

  const displayBackground =
    featuredMedia && !sectionLevelPage ? (
      <HeaderBackground
        backgroundTexture={backgroundTexture}
        hasWobblyEdge={!isLanding}
      />
    ) : undefined;

  const Header = (
    <PageHeader
      breadcrumbs={breadcrumbs}
      labels={labels}
      title={page.title}
      FeaturedMedia={featuredMedia}
      Background={displayBackground}
      ContentTypeInfo={DateInfo}
      backgroundTexture={
        !featuredMedia && !sectionLevelPage ? backgroundTexture : undefined
      }
      highlightHeading={true}
      isContentTypeInfoBeforeMedia={false}
      sectionLevelPage={sectionLevelPage}
    />
  );

  // Find the items that have an 'order' property, and sort by those first,
  // Then any remaining will be added to the end in the order they
  // come from Prismic (date created)
  function orderItems(group: SiblingsGroup<PageType>): PageType[] {
    const groupWithOrder = group.siblings.map(sibling => {
      const parent = sibling.parentPages.find(p => p.id === group.id);
      const order = parent?.order;

      return {
        ...sibling,
        order,
      };
    });

    const orderedItems: PageType[] = groupWithOrder
      .filter(s => Boolean(s.order))
      .sort((a, b) => a.order! - b.order!);

    const unorderedItems: PageType[] = groupWithOrder.filter(s => !s.order);

    return [...orderedItems, ...unorderedItems];
  }

  const Siblings = siblings.map((siblingGroup, i) =>
    siblingGroup.siblings.length > 0 ? (
      <SpacingSection key={i}>
        <SpacingComponent>
          <SectionHeader
            title={`More from ${siblingGroup.title}`}
            gridSize={gridSize12()}
          />
        </SpacingComponent>
        <SpacingComponent>
          <CardGrid items={orderItems(siblingGroup)} itemsPerRow={3} />
        </SpacingComponent>
      </SpacingSection>
    ) : null
  );

  const Children =
    children.siblings.length > 0
      ? [
          <SpacingSection key={1}>
            <SpacingComponent>
              <CardGrid items={orderItems(children)} itemsPerRow={3} />
            </SpacingComponent>
          </SpacingSection>,
        ]
      : [];

  // If we have a vanity URL, we prefer that for the link rel="canonical"
  // in the page <head>; it means the canonical URL will match the links
  // we put elsewhere on the website, e.g. in the header.
  const pathname = vanityUrl || `/pages/${page.id}`;

  return (
    <PageLayout
      title={page.title}
      description={page.metadataDescription || page.promo?.caption || ''}
      url={{ pathname }}
      jsonLd={jsonLd}
      openGraphType="website"
      siteSection={page?.siteSection as SiteSection}
      image={page.image}
      apiToolbarLinks={[createPrismicLink(page.id)]}
    >
      <ContentPage
        id={page.id}
        Header={Header}
        Body={
          <Body
            untransformedBody={untransformedBody}
            pageId={page.id}
            onThisPage={page.onThisPage}
            showOnThisPage={page.showOnThisPage}
            isLanding={isLanding}
            sectionLevelPage={sectionLevelPage}
            staticContent={staticContent}
          />
        }
        /**
         * We use this order because people want to:
         * - Explore deeper into a subject (children)
         * - Explore around a subject (siblings)
         */
        RelatedContent={[...Children, ...Siblings]}
        postOutroContent={postOutroContent}
        contributors={page.contributors}
        seasons={page.seasons}
      />
    </PageLayout>
  );
};

export default Page;
