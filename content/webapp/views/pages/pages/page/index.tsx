import { FunctionComponent, ReactElement } from 'react';

import {
  prismicPageIds,
  sectionLevelPages,
} from '@weco/common/data/hardcoded-ids';
import { SiteSection } from '@weco/common/model/site-section';
import linkResolver from '@weco/common/services/prismic/link-resolver';
import {
  headerBackgroundLs,
  landingHeaderBackgroundLs,
} from '@weco/common/utils/backgrounds';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createPrismicLink } from '@weco/common/views/components/ApiToolbar';
import { links } from '@weco/common/views/components/Header';
import HeaderBackground from '@weco/common/views/components/HeaderBackground';
import { HTMLDate } from '@weco/common/views/components/HTMLDateAndTime';
import { JsonLdObj } from '@weco/common/views/components/JsonLd';
import { makeLabels } from '@weco/common/views/components/LabelsList';
import { gridSize12 } from '@weco/common/views/components/Layout';
import PageHeader from '@weco/common/views/components/PageHeader';
import SpacingComponent from '@weco/common/views/components/styled/SpacingComponent';
import SpacingSection from '@weco/common/views/components/styled/SpacingSection';
import VideoEmbed from '@weco/common/views/components/VideoEmbed';
import PageLayout from '@weco/common/views/layouts/PageLayout';
import { PageFormatIds } from '@weco/content/data/content-format-ids';
import { transformEmbedSlice } from '@weco/content/services/prismic/transformers/body';
import { isEditorialImage, isVideoEmbed } from '@weco/content/types/body';
import { Page as PageType } from '@weco/content/types/pages';
import { SiblingsGroup } from '@weco/content/types/siblings-group';
import Body from '@weco/content/views/components/Body';
import CardGrid from '@weco/content/views/components/CardGrid';
import ContentPage from '@weco/content/views/components/ContentPage';
import { getFeaturedPictureWithTasl } from '@weco/content/views/components/ImageWithTasl';
import SectionHeader from '@weco/content/views/components/SectionHeader';

export type Props = {
  page: PageType;
  siblings: SiblingsGroup<PageType>[];
  children: SiblingsGroup<PageType>;
  ordersInParents: OrderInParent[];
  staticContent: ReactElement | null;
  jsonLd: JsonLdObj;
};

export type OrderInParent = {
  id: string;
  uid: string;
  title: string;
  order: number;
  tags?: string[];
  siteSection?: SiteSection;
  type: 'pages' | 'exhibitions';
};

export const PagePage: FunctionComponent<Props> = ({
  page,
  siblings,
  children,
  ordersInParents,
  staticContent,
  jsonLd,
}) => {
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

  const sectionLevelPage = sectionLevelPages.includes(page.uid);

  function getBreadcrumbText(siteSection: string): string {
    return isLanding
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
      ...ordersInParents.map(siblingGroup => {
        return {
          url: linkResolver(siblingGroup),
          text: siblingGroup.title || '',
          prefix: `Part ${siblingGroup.order || ''} of`,
        };
      }),
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

  return (
    <PageLayout
      title={page.title}
      description={page.metadataDescription || page.promo?.caption || ''}
      url={{
        pathname: `${page?.siteSection ? '/' + page.siteSection : ''}/${page.uid}`,
      }}
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
            introText={page.introText}
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
        contributors={page.contributors}
        seasons={page.seasons}
      />
    </PageLayout>
  );
};

export default PagePage;
