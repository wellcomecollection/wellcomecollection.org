// @flow
import { type Context } from 'next';
import { getExhibitionWithRelatedContent } from '@weco/common/services/prismic/exhibitions';
import Exhibition, { type Props } from '../components/Exhibition/Exhibition';
import Installation from '../components/Installation/Installation';
// $FlowFixMe (tsx)
import { convertJsonToDates } from './event';

const ExhibitionPage = ({
  exhibition,
  pages,
  events,
  articles,
  books,
  exhibitions,
}: Props) => {
  if (exhibition.format && exhibition.format.title === 'Installation') {
    return <Installation installation={exhibition} />;
  } else {
    return (
      <Exhibition
        exhibition={exhibition}
        pages={pages}
        events={events.map(convertJsonToDates)}
        articles={articles}
        books={books}
        exhibitions={exhibitions}
      />
    );
  }
};

ExhibitionPage.getInitialProps = async (ctx: Context) => {
  const { id, memoizedPrismic } = ctx.query;
  const {
    exhibition,
    pages,
    events,
    articles,
    books,
    exhibitions,
  } = await getExhibitionWithRelatedContent({
    request: ctx.req,
    id,
    memoizedPrismic,
  });

  if (exhibition) {
    return {
      exhibition,
      pages: pages?.results || [],
      events: events?.results || [],
      articles: articles?.results || [],
      books: books?.results || [],
      exhibitions: exhibitions?.results || [],
    };
  } else {
    return { statusCode: 404 };
  }
};
export default ExhibitionPage;
