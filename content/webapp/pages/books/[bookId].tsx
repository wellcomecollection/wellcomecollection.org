import { GetServerSideProps } from 'next';
import { FunctionComponent } from 'react';

import { getServerData } from '@weco/common/server-data';
import { SimplifiedServerData } from '@weco/common/server-data/types';
import { AppErrorProps } from '@weco/common/services/app';
import { GaDimensions } from '@weco/common/services/app/analytics-scripts';
import { Pageview } from '@weco/common/services/conversion/track';
import { looksLikePrismicId } from '@weco/common/services/prismic';
import { serialiseProps } from '@weco/common/utils/json';
import { isNotUndefined } from '@weco/common/utils/type-guards';
import { createClient } from '@weco/content/services/prismic/fetch';
import { fetchBook } from '@weco/content/services/prismic/fetch/books';
import { transformBook } from '@weco/content/services/prismic/transformers/books';
import { setCacheControl } from '@weco/content/utils/setCacheControl';
import BookPage, {
  Props as BookPageProps,
} from '@weco/content/views/books/book';

type Props = BookPageProps & {
  gaDimensions: GaDimensions;
  pageview: Pageview;
  serverData: SimplifiedServerData; // TODO should we enforce this?
};

const Page: FunctionComponent<BookPageProps> = props => {
  return <BookPage {...props} />;
};

export const getServerSideProps: GetServerSideProps<
  Props | AppErrorProps
> = async context => {
  setCacheControl(context.res);
  const { bookId } = context.query;

  if (!looksLikePrismicId(bookId)) {
    return { notFound: true };
  }
  const client = createClient(context);
  const bookDocument = await fetchBook(client, bookId);

  if (isNotUndefined(bookDocument)) {
    const serverData = await getServerData(context);
    const book = transformBook(bookDocument);

    return {
      props: serialiseProps<Props>({
        book,
        serverData,
        gaDimensions: {
          partOf: book.seasons.map(season => season.id),
        },
        pageview: {
          name: 'story',
          properties: { type: bookDocument.type },
        },
      }),
    };
  }

  return { notFound: true };
};

export default Page;
