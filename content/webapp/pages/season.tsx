import { NextPageContext } from 'next';
import { Component, ReactElement } from 'react';
import PageLayout from '@weco/common/views/components/PageLayout/PageLayout';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { getPage } from '@weco/common/services/prismic/pages';
import { contentLd } from '@weco/common/utils/json-ld';
import Body from '@weco/common/views/components/Body/Body';
import { Season } from '@weco/common/model/season';

type Props = {
  page: Season;
};

export class Page extends Component<Props> {
  static getInitialProps = async (
    ctx: NextPageContext
  ): Promise<Props | { statusCode: number }> => {
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

  render(): ReactElement<Props> {
    const { page } = this.props;
    const genericFields = {
      id: page.id,
      title: page.title,
      contributors: page.contributors,
      contributorsTitle: page.contributorsTitle,
      promo: page.promo,
      body: page.body,
      standfirst: page.standfirst,
      promoImage: page.promoImage,
      promoText: page.promoText,
      image: page.image,
      squareImage: page.squareImage,
      widescreenImage: page.widescreenImage,
      labels: page.labels,
      metadataDescription: page.metadataDescription,
    };

    const ContentTypeInfo = page.standfirst && (
      <PageHeaderStandfirst html={page.standfirst} />
    );
    const FeaturedMedia = getFeaturedMedia(genericFields);
    const Header = (
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={{ labels: page.labels }}
        title={page.title}
        ContentTypeInfo={ContentTypeInfo}
        Background={<HeaderBackground hasWobblyEdge={true} />}
        FeaturedMedia={FeaturedMedia}
        HeroPicture={null}
      />
    );

    return (
      <PageLayout
        title={page.title}
        description={page.metadataDescription || page.promoText || ''}
        url={{ pathname: `/seasons/${page.id}` }}
        jsonLd={contentLd(page)}
        siteSection={'whats-on'}
        openGraphType={'website'}
        imageUrl={page.image && convertImageUri(page.image.contentUrl, 800)}
        imageAltText={page.image && page.image.alt}
      >
        <ContentPage
          id={page.id}
          Header={Header}
          Body={<Body body={page.body} pageId={page.id} />}
        ></ContentPage>
      </PageLayout>
    );
  }
}

export default Page;
