import { NextPageContext } from 'next';
import { Component, ReactElement } from 'react';
import { SeasonWithContent } from '@weco/common/model/season';
import PageLayout from '@weco/common/views/components/PageLayoutDeprecated/PageLayoutDeprecated';
import ContentPage from '@weco/common/views/components/ContentPage/ContentPage';
import HeaderBackground from '@weco/common/views/components/HeaderBackground/HeaderBackground';
import PageHeaderStandfirst from '@weco/common/views/components/PageHeaderStandfirst/PageHeaderStandfirst';
import PageHeader, {
  getFeaturedMedia,
} from '@weco/common/views/components/PageHeader/PageHeader';
import { convertImageUri } from '@weco/common/utils/convert-image-uri';
import { contentLd } from '@weco/common/utils/json-ld';
import Body from '@weco/common/views/components/Body/Body';
import { getSeasonWithContent } from '@weco/common/services/prismic/seasons';
import CardGrid from '@weco/common/views/components/CardGrid/CardGrid';
export class Page extends Component<SeasonWithContent> {
  static getInitialProps = async (
    ctx: NextPageContext
  ): Promise<SeasonWithContent | { statusCode: number }> => {
    const { id, memoizedPrismic } = ctx.query;
    const seasonWithContent = await getSeasonWithContent(
      ctx.req,
      {
        id,
        pageSize: 100,
      },
      memoizedPrismic
    );

    if (seasonWithContent) {
      return seasonWithContent;
    } else {
      return { statusCode: 404 };
    }
  };

  render(): ReactElement<SeasonWithContent> {
    const { season, articles, books, events, exhibitions } = this.props;
    const genericFields = {
      id: season.id,
      title: season.title,
      contributors: season.contributors,
      contributorsTitle: season.contributorsTitle,
      promo: season.promo,
      body: season.body,
      standfirst: season.standfirst,
      promoImage: season.promoImage,
      promoText: season.promoText,
      image: season.image,
      squareImage: season.squareImage,
      widescreenImage: season.widescreenImage,
      labels: season.labels,
      metadataDescription: season.metadataDescription,
    };

    const ContentTypeInfo = season.standfirst && (
      <PageHeaderStandfirst html={season.standfirst} />
    );
    const FeaturedMedia = getFeaturedMedia(genericFields);
    const Header = (
      <PageHeader
        breadcrumbs={{ items: [] }}
        labels={{ labels: season.labels }}
        title={season.title}
        ContentTypeInfo={ContentTypeInfo}
        Background={<HeaderBackground hasWobblyEdge={true} />}
        FeaturedMedia={FeaturedMedia}
        HeroPicture={null}
      />
    );

    return (
      <PageLayout
        title={season.title}
        description={season.metadataDescription || season.promoText || ''}
        url={{ pathname: `/seasons/${season.id}` }}
        jsonLd={contentLd(season)}
        siteSection={'whats-on'}
        openGraphType={'website'}
        imageUrl={season.image && convertImageUri(season.image.contentUrl, 800)}
        imageAltText={season.image && season.image.alt}
      >
        <ContentPage
          id={season.id}
          Header={Header}
          Body={<Body body={season.body} pageId={season.id} />}
        ></ContentPage>
        <CardGrid
          items={[...articles, ...books, ...events, ...exhibitions]}
          itemsPerRow={4}
        />
      </PageLayout>
    );
  }
}

export default Page;
