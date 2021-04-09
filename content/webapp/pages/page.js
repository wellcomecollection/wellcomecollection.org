// @flow
import type { Context } from 'next';
import { Component } from 'react';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
// $FlowFixMe (tsx)
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
// $FlowFixMe (tsx)
import Body from '@weco/common/views/components/Body/Body';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
// $FlowFixMe(tsx)
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
// $FlowFixMe(tsx)
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import {
  getPage,
  getPageSiblings,
  getChildren,
} from '@weco/common/services/prismic/pages';
import { contentLd } from '@weco/common/utils/json-ld';
import type { Page as PageType } from '@weco/common/model/pages';
import type { SiblingsGroup } from '@weco/common/model/siblings-group';
import {
  headerBackgroundLs,
  landingHeaderBackgroundLs,
  // $FlowFixMe (ts)
} from '@weco/common/utils/backgrounds';
import {
  prismicPageIds,
  sectionLevelPages,
} from '@weco/common/services/prismic/hardcoded-id';
// $FlowFixMe (ts)
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';
import { PageFormatIds } from '@weco/common/model/content-format-id';
// $FlowFixMe (tsx)
import { links } from '@weco/common/views/components/Header/Header';
// $FlowFixMe (tsx)
import { type Props as LabelsListProps } from '@weco/common/views/components/LabelsList/LabelsList';

type Props = {|
  page: PageType,
  siblings: SiblingsGroup[],
  children: SiblingsGroup,
|};
export class Page extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id, memoizedPrismic } = ctx.query;
    const page = await getPage(ctx.req, id, memoizedPrismic);
    if (page) {
      const siblings = await getPageSiblings(page, ctx.req, memoizedPrismic);
      const children = await getChildren(page, ctx.req, memoizedPrismic);
      return {
        page,
        siblings,
        children,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    function makeLabels(title?: string): ?LabelsListProps {
      if (!title) return null;

      return { labels: [{ text: title }] };
    }

    const { page, siblings, children } = this.props;
    const DateInfo = page.datePublished && (
      <HTMLDate date={new Date(page.datePublished)} />
    );
    const isLanding = page.format && page.format.id === PageFormatIds.Landing;
    const labels =
      !isLanding && page.format?.title ? makeLabels(page.format?.title) : null;

    const backgroundTexture = isLanding
      ? landingHeaderBackgroundLs
      : headerBackgroundLs;
    const hasFeaturedMedia =
      page.body.length > 1 &&
      (page.body[0].type === 'picture' || page.body[0].type === 'videoEmbed');
    const body = hasFeaturedMedia
      ? page.body.slice(1, page.body.length)
      : page.body;
    const FeaturedMedia = hasFeaturedMedia ? (
      page.body[0].type === 'picture' ? (
        <UiImage
          {...(page.body[0].value.image.crops['16:9'] ||
            page.body[0].value.image)}
        />
      ) : page.body[0].type === 'videoEmbed' ? (
        <VideoEmbed {...page.body[0].value} />
      ) : null
    ) : null;

    const hiddenBreadcrumbPages = [
      prismicPageIds.covidWelcomeBack,
      prismicPageIds.covidBookYourTicket,
    ];

    const sectionLevelPage = sectionLevelPages.includes(page.id);
    function getBreadcrumbText(siteSection: string, pageId: string): string {
      return hiddenBreadcrumbPages.includes(page.id) || isLanding
        ? '\u200b'
        : links.find(link => link.siteSection === siteSection)?.title ||
            siteSection;
    }

    // TODO: This is not the way to do site sections
    const sectionItem = page.siteSection
      ? [
          {
            text: getBreadcrumbText(page.siteSection, page.id),
            url: page.siteSection ? `/${page.siteSection}` : '',
          },
        ]
      : [];

    const breadcrumbs = {
      items: [
        ...sectionItem,
        ...siblings.map(siblingGroup => ({
          url: `/pages/${siblingGroup.id}`,
          text: siblingGroup.title || '',
          prefix: `Part of`,
        })),
      ],
    };

    const displayBackground =
      FeaturedMedia && !sectionLevelPage ? (
        <HeaderBackground
          backgroundTexture={backgroundTexture}
          hasWobblyEdge={!isLanding}
        />
      ) : null;

    const Header = (
      <PageHeader
        breadcrumbs={breadcrumbs}
        labels={labels}
        title={page.title}
        FeaturedMedia={FeaturedMedia}
        Background={displayBackground}
        ContentTypeInfo={DateInfo}
        HeroPicture={null}
        backgroundTexture={
          !FeaturedMedia && !sectionLevelPage ? backgroundTexture : null
        }
        highlightHeading={true}
        isContentTypeInfoBeforeMedia={false}
        sectionLevelPage={sectionLevelPage}
      />
    );
    const Siblings = siblings.map((siblingGroup, i) => {
      if (siblingGroup.siblings.length > 0) {
        return (
          <SpacingSection key={i}>
            <SpacingComponent>
              <SectionHeader title={`More from ${siblingGroup.title}`} />
            </SpacingComponent>
            <SpacingComponent>
              <CardGrid items={siblingGroup.siblings} itemsPerRow={3} />
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
                <CardGrid items={children.siblings} itemsPerRow={3} />
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
        siteSection={page.siteSection ?? null}
        imageUrl={page.image && convertImageUri(page.image.contentUrl, 800)}
        imageAltText={page.image && page.image.alt}
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
          RelatedContent={[...Siblings, ...Children]}
          contributorProps={{ contributors: page.contributors }}
          seasons={page.seasons}
        />
      </PageLayout>
    );
  }
}

export default Page;
