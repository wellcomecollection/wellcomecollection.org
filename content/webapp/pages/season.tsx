import { NextPageContext } from 'next';
import { Component, ReactElement } from 'react';
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
import { Season } from '@weco/common/model/season';
import { getSeasonWithContent } from '@weco/common/services/prismic/seasons';
// import BookPromo from '../../../common/views/components/BookPromo/BookPromo';

type Props = {
  season: Season;
  books: any; // TODO
};

export class Page extends Component<Props> {
  static getInitialProps = async (
    // TODO getServerSideProps
    ctx: NextPageContext
  ): Promise<Props | { statusCode: number }> => {
    const { id, memoizedPrismic } = ctx.query;
    const seasonWithContent = await getSeasonWithContent(
      ctx.req,
      {
        id,
        pageSize: 100,
      },
      memoizedPrismic
    );
    // console.dir(seasonWithContent, { depth: null });

    if (seasonWithContent) {
      return seasonWithContent;
    } else {
      return { statusCode: 404 };
    }
  };

  render(): ReactElement<Props> {
    const { season, books } = this.props;
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
        >
          <h2>Books</h2>
          {books &&
            books.map(
              book => JSON.stringify(book)
              // <BookPromo
              //   key={book.id}
              //   url={`/books/${book.id}`}
              //   title={book.title}
              //   subtitle={book.subtitle}
              //   description={book.promoText}
              //   image={book.cover}
              // />
            )}
          {/* <h2>Events</h2>
          {events && events.map(event => JSON.stringify(event))}
          <h2>Exhibitions</h2>
          {exhibitions &&
            exhibitions.map(exhibition => JSON.stringify(exhibition))}
          <h2>Stories</h2>
          {stories && stories.map(story => JSON.stringify(story))} */}
          {/* <h2>People</h2>
          {people &&
            people.map(
              person => JSON.stringify(person)
            )} */}
        </ContentPage>
      </PageLayout>
    );
  }
}

export default Page;
