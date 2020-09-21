// @flow
import type { Context } from 'next';
import { Component } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import LandingBody from '@weco/common/views/components/LandingBody/LandingBody';
import HTMLDate from '@weco/common/views/components/HTMLDate/HTMLDate';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeader from '@weco/common/views/components/PageHeader/PageHeader';
import VideoEmbed from '@weco/common/views/components/VideoEmbed/VideoEmbed';
import { UiImage } from '@weco/common/views/components/Images/Images';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { getPage } from '@weco/common/services/prismic/pages';
import { contentLd } from '@weco/common/utils/json-ld';
import type { Page as PageType } from '@weco/common/model/pages';

type Props = {|
  page: PageType,
|};

const backgroundTexture =
  'https://wellcomecollection.cdn.prismic.io/wellcomecollection%2F9154df28-e179-47c0-8d41-db0b74969153_wc+brand+backgrounds+2_pattern+2+colour+1.svg';
export class Page extends Component<Props> {
  static getInitialProps = async (ctx: Context) => {
    const { id, memoizedPrismic } = ctx.query;
    ctx.query.memoizedPrismic = undefined; // Once we've got memoizedPrismic, we need to remove it before making requests - otherwise we hit circular object issues with JSON.stringify
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

    const Header = (
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={null}
        title={page.title}
        FeaturedMedia={FeaturedMedia}
        Background={
          FeaturedMedia && (
            <HeaderBackground backgroundTexture={backgroundTexture} />
          )
        }
        ContentTypeInfo={DateInfo}
        HeroPicture={null}
        backgroundTexture={!FeaturedMedia ? backgroundTexture : null}
        highlightHeading={true}
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
          Body={<LandingBody body={body} pageId={page.id} />}
        />
      </PageLayout>
    );
  }
}

export default Page;
