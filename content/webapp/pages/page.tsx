import { FC } from 'react';
import PageLayout, {
  SiteSection,
} from '@weco/common/views/components/PageLayout/PageLayout';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import {
  getPage,
  getPageSiblings,
  getChildren,
} from '@weco/common/services/prismic/pages';
import { Page as PageType } from '@weco/common/model/pages';
import { SiblingsGroup } from '@weco/common/model/siblings-group';
import {
  headerBackgroundLs,
  landingHeaderBackgroundLs,
} from '@weco/common/utils/backgrounds';
import {
  prismicPageIds,
  sectionLevelPages,
} from '@weco/common/services/prismic/hardcoded-id';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import { PageFormatIds } from '@weco/common/model/content-format-id';
import { links } from '@weco/common/views/components/Header/Header';
import { Props as LabelsListProps } from '@weco/common/views/components/LabelsList/LabelsList';
import { AppErrorProps, WithGaDimensions } from '@weco/common/views/pages/_app';
import { GetServerSideProps } from 'next';
import { removeUndefinedProps } from '@weco/common/utils/json';
import { getServerData } from '@weco/common/server-data';
import CardGrid from '../components/CardGrid/CardGrid';
import Body from '../components/Body/Body';
import ContentPage from '../components/ContentPage/ContentPage';
import { contentLd } from '../services/prismic/transformers/json-ld';

type Props = {
  page: PageType;
  siblings: SiblingsGroup[];
  children: SiblingsGroup;
  ordersInParents: OrderInParent[];
} & WithGaDimensions;

type OrderInParent = {
  id: string;
  title: string;
  order: number;
  type: 'pages' | 'exhibitions';
};

export const getServerSideProps: GetServerSideProps<Props | AppErrorProps> =
  async context => {
    const serverData = await getServerData(context);
    const { id, memoizedPrismic } = context.query;
    const page: PageType | undefined = await getPage(
      context.req,
      id,
      memoizedPrismic
    );
    if (page) {
      const siblings = await getPageSiblings(
        page,
        context.req,
        memoizedPrismic
      );
      const ordersInParents: OrderInParent[] =
        page.parentPages.map(p => {
          return {
            id: p.id,
            title: p.title,
            order: p.order,
            type: p.type,
          };
        }) || [];

      const children = await getChildren(page, context.req, memoizedPrismic);
      return {
        props: removeUndefinedProps({
          page,
          siblings,
          children,
          ordersInParents,
          serverData,
          gaDimensions: {
            partOf: page.seasons.map<string>(season => season.id),
          },
        }),
      };
    } else {
      return { notFound: true };
    }
  };

const Page: FC<Props> = ({ page, siblings, children, ordersInParents }) => {
  function makeLabels(title?: string): LabelsListProps | undefined {
    if (!title) return;

    return { labels: [{ text: title }] };
  }

  const DateInfo = page.datePublished && (
    <HTMLDate date={new Date(page.datePublished)} />
  );
  const isLanding = page.format && page.format.id === PageFormatIds.Landing;
  const labels =
    !isLanding && page.format?.title
      ? makeLabels(page.format?.title)
      : undefined;

  const backgroundTexture = isLanding
    ? landingHeaderBackgroundLs
    : headerBackgroundLs;

  const hasFeaturedMedia =
    page.body.length > 1 &&
    (page.body[0].type === 'picture' || page.body[0].type === 'videoEmbed');

  const body = hasFeaturedMedia
    ? page.body.slice(1, page.body.length)
    : page.body;

  const featuredMedia = hasFeaturedMedia ? (
    page.body[0].type === 'picture' ? (
      <UiImage
        {...(page.body[0].value.image.crops['16:9'] ||
          page.body[0].value.image)}
      />
    ) : page.body[0].type === 'videoEmbed' ? (
      <VideoEmbed {...page.body[0].value} />
    ) : undefined
  ) : undefined;

  const hiddenBreadcrumbPages = [
    prismicPageIds.covidWelcomeBack,
    prismicPageIds.covidBookYourTicket,
  ];

  const sectionLevelPage = sectionLevelPages.includes(page.id);

  function getBreadcrumbText(siteSection: string): string {
    return hiddenBreadcrumbPages.includes(page.id) || isLanding
      ? '\u200b'
      : links.find(link => link.siteSection === siteSection)?.title ||
          siteSection;
  }

  // TODO: This is not the way to do site sections
  const sectionItem = page.siteSection
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
      HeroPicture={undefined}
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
  function orderItems(group: SiblingsGroup): PageType[] {
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

  const Siblings = siblings.map((siblingGroup, i) => {
    if (siblingGroup.siblings.length > 0) {
      return (
        <SpacingSection key={i}>
          <SpacingComponent>
            <SectionHeader title={`More from ${siblingGroup.title}`} />
          </SpacingComponent>
          <SpacingComponent>
            <CardGrid items={orderItems(siblingGroup)} itemsPerRow={3} />
          </SpacingComponent>
        </SpacingSection>
      );
    }
  });

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
      description={page.metadataDescription || page.promoText || ''}
      url={{ pathname: `/pages/${page.id}` }}
      jsonLd={contentLd(page)}
      openGraphType={'website'}
      siteSection={page?.siteSection as SiteSection}
      imageUrl={page.image && convertImageUri(page.image.contentUrl, 800)}
      imageAltText={(page.image && page.image.alt) ?? undefined}
    >
      <ContentPage
        id={page.id}
        Header={Header}
        Body={
          <Body
            body={body}
            pageId={page.id}
            onThisPage={page.onThisPage}
            showOnThisPage={page.showOnThisPage}
            isLanding={isLanding}
            sectionLevelPage={sectionLevelPage}
          />
        }
        /**
         * We use this order because people want to:
         * - Explore deeper into a subject (children)
         * - Explore around a subject (siblings)
         */
        RelatedContent={[...Children, ...Siblings]}
        document={page.prismicDocument}
        seasons={page.seasons}
      />
    </PageLayout>
  );
};

export default Page;
