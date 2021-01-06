// @flow
import type { Context } from 'next';
import { Component } from 'react';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
// $FlowFixMe (tsx)
import Body from '@weco/common/views/components/Body/Body';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { getPage } from '@weco/common/services/prismic/pages';
import { contentLd } from '@weco/common/utils/json-ld';
import type { Page as PageType } from '@weco/common/model/pages';
import { headerBackgroundLs } from '@weco/common/utils/backgrounds';
import { prismicPageIds } from '@weco/common/services/prismic/hardcoded-id';

type Props = {|
  page: PageType,
|};

const backgroundTexture = headerBackgroundLs;
export class Page extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id, memoizedPrismic } = ctx.query;
    const page = await getPage(ctx.req, id, memoizedPrismic);
    if (page) {
      return {
        page,
      };
    } else {
      return { statusCode: 404 };
    }
  };

  render() {
    const { page } = this.props;
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
    const breadcrumbs = {
      items: page.siteSection
        ? [
            {
              text: getBreadcrumbText(page.siteSection, page.id),
              url: page.siteSection ? `/${page.siteSection}` : '',
            },
          ]
        : [],
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
          seasons={page.seasons}
        />
      </PageLayout>
    );
  }
}

export default Page;
