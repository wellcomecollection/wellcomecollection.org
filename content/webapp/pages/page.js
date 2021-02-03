// @flow
import type { Context } from 'next';
import { Component } from 'react';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
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
import { getPage, getPageSiblings } from '@weco/common/services/prismic/pages';
import { contentLd } from '@weco/common/utils/json-ld';
import type { Page as PageType } from '@weco/common/model/pages';
// $FlowFixMe (tsx)
import type { SiblingsGroup } from '@weco/common/model/siblings-group';
// $FlowFixMe (ts)
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
import SpacingSection from '@weco/common/views/components/SpacingSection/SpacingSection';
import SpacingComponent from '@weco/common/views/components/SpacingComponent/SpacingComponent';
import SectionHeader from '@weco/common/views/components/SectionHeader/SectionHeader';

type Props = {|
  page: PageType,
  siblings: SiblingsGroup,
|};

const backgroundTexture = headerBackgroundLs;
export class Page extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id, memoizedPrismic } = ctx.query;
    const page = await getPage(ctx.req, id, memoizedPrismic);
    if (page) {
      const siblings = await getPageSiblings(page, ctx.req, memoizedPrismic);
      return {
        page,
        siblings,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { page, siblings } = this.props;
    const DateInfo = page.datePublished && (
      <HTMLDate date={new Date(page.datePublished)} />
    );

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

    function getBreadcrumbText(siteSection: string, pageId: string): string {
      return hiddenBreadcrumbPages.includes(page.id)
        ? '\u200b'
        : siteSection === 'visit-us'
        ? 'Visit us'
        : 'What we do';
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
        // Only using the first of the siblingsGroup in the list
        // This should be fine as in reality there shouldn't be more than one
        // Don't have capacity to implement a better solution
        ...siblings.slice(0, 1).map(siblingGroup => ({
          url: `/landing-pages/${siblingGroup.id}`,
          text: siblingGroup.title || '',
          prefix: `Part of`,
        })),
      ],
    };

    const Header = (
      <PageHeader
        breadcrumbs={breadcrumbs}
        labels={null}
        title={page.title}
        FeaturedMedia={FeaturedMedia}
        Background={
          FeaturedMedia && (
            <HeaderBackground
              backgroundTexture={backgroundTexture}
              hasWobblyEdge={true}
            />
          )
        }
        ContentTypeInfo={DateInfo}
        HeroPicture={null}
        backgroundTexture={!FeaturedMedia ? backgroundTexture : null}
        highlightHeading={true}
        isContentTypeInfoBeforeMedia={false}
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
              <CardGrid key={i} items={siblingGroup.siblings} itemsPerRow={3} />
            </SpacingComponent>
          </SpacingSection>
        );
      }
    });
    return (
      <PageLayout
        title={page.title}
        description={page.metadataDescription || page.promoText || ''}
        url={{ pathname: `/pages/${page.id}` }}
        jsonLd={contentLd(page)}
        openGraphType={'website'}
        siteSection={
          page.siteSection === 'what-we-do' || page.siteSection === 'visit-us'
            ? page.siteSection
            : null
        }
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
            />
          }
          Siblings={Siblings}
          contributorProps={{ contributors: page.contributors }}
          seasons={page.seasons}
        />
      </PageLayout>
    );
  }
}

export default Page;
